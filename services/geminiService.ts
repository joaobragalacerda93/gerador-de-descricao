
import { GoogleGenAI } from "@google/genai";
import type { ProductDescription, Source } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function cleanJsonString(str: string): string {
    // Remove markdown code block fences
    let cleaned = str.replace(/^```json\s*/, '').replace(/```$/, '');
    // Trim whitespace
    cleaned = cleaned.trim();
    return cleaned;
}

export const generateDescription = async (
  productName: string,
  additionalInfo: string
): Promise<{ description: ProductDescription; sources: Source[] }> => {
  const prompt = `
    Atue como um especialista em marketing e copywriting de e-commerce de classe mundial.
    Sua tarefa é criar uma descrição de produto completa e persuasiva para: "${productName}".

    Informações adicionais a serem consideradas: "${additionalInfo || 'Nenhuma informação adicional fornecida.'}"

    Pesquise na web usando a ferramenta de busca para obter informações detalhadas, características técnicas, benefícios e pontos de venda únicos para este produto ou produtos semelhantes.

    Sua resposta DEVE ser um único objeto JSON válido, sem nenhum texto ou formatação adicional fora do JSON. O objeto JSON deve ter a seguinte estrutura:
    {
      "title": "Um título otimizado para SEO com 60-70 caracteres.",
      "catchyPhrase": "Uma frase de efeito curta e memorável.",
      "detailedDescription": "Uma descrição detalhada (2-3 parágrafos) que conta uma história, evoca emoção e foca nos benefícios para o cliente. Use uma linguagem persuasiva.",
      "features": [
        "Uma lista de 5 a 7 dos recursos mais importantes, cada um apresentado como um benefício. Ex: 'Design Ergonômico: Conforto garantido durante todo o dia.'",
        "Outro recurso/benefício.",
        "..."
      ],
      "technicalSpecifications": {
        "Chave1": "Valor1",
        "Chave2": "Valor2",
        "Material": "Ex: Fibra de carbono e malha respirável",
        "...": "adicione especificações relevantes como dimensões, peso, compatibilidade, etc."
      },
      "faq": [
        {
          "question": "Primeira pergunta comum que um cliente poderia ter.",
          "answer": "Resposta clara e concisa para a primeira pergunta."
        },
        {
          "question": "Segunda pergunta comum.",
          "answer": "Resposta clara e concisa para a segunda pergunta."
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const jsonString = cleanJsonString(response.text);
    const parsedDescription: ProductDescription = JSON.parse(jsonString);

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as Source[] || [];

    return { description: parsedDescription, sources };
  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Falha ao analisar a resposta da IA. A resposta não era um JSON válido.");
    }
    throw new Error("Erro ao se comunicar com a API do Gemini.");
  }
};

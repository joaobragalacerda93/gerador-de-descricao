
import React, { useState, useCallback } from 'react';
import { generateDescription } from './services/geminiService';
import type { ProductDescription, Source } from './types';
import ProductDescriptionDisplay from './components/ProductDescriptionDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<ProductDescription | null>(null);
  const [sources, setSources] = useState<Source[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!productName.trim()) {
      setError('Por favor, insira o nome ou uma breve descrição do produto.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDescription(null);
    setSources([]);

    try {
      const result = await generateDescription(productName, additionalInfo);
      setDescription(result.description);
      setSources(result.sources);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar a descrição. Verifique o console para mais detalhes ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [productName, additionalInfo]);

  return (
    <div className="min-h-screen bg-[#0c2749] text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffe600]">
            Gerador de Descrição de Produto
          </h1>
          <p className="mt-4 text-lg text-slate-200">
            Crie descrições persuasivas e completas para sua loja, otimizadas para conversão.
          </p>
        </header>

        <main>
          <div className="bg-[#1a3a69]/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-blue-700">
            <div className="space-y-6">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-slate-200 mb-2">
                  Nome do Produto ou Breve Descrição *
                </label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Tênis de corrida masculino para maratonas"
                  className="w-full bg-[#1a3a69] border border-blue-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffe600] transition-shadow duration-300"
                />
              </div>
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-200 mb-2">
                  Público-alvo ou Pontos a Destacar (Opcional)
                </label>
                <textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Ex: Corredores de longa distância, material ultra-leve, alta absorção de impacto"
                  rows={3}
                  className="w-full bg-[#1a3a69] border border-blue-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffe600] transition-shadow duration-300"
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-[#ffe600] hover:bg-yellow-400 text-[#0c2749] font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    Gerando...
                  </>
                ) : (
                  'Gerar Descrição Mágica ✨'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {description && (
            <div className="mt-10">
              <ProductDescriptionDisplay description={description} sources={sources} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
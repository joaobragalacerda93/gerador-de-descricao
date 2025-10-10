import React, { useState, useCallback, useEffect } from 'react';
import { generateDescription } from './services/geminiService';
import type { ProductDescription, Source, HistoryItem } from './types';
import ProductDescriptionDisplay from './components/ProductDescriptionDisplay';
import HistoryDisplay from './components/HistoryDisplay';
import Loader from './components/Loader';

const HISTORY_KEY = 'productDescriptionHistory';
const FONT_SIZE_KEY = 'productDescriptionFontSize';
const INITIAL_HISTORY_DISPLAY = 5;
const MAX_HISTORY_STORAGE = 50;
const PAGINATION_THRESHOLD = 10; // Exibir tudo se for 10 ou menos, caso contrário, paginar.
const FONT_SIZES = ['sm', 'base', 'lg', 'xl'];

const App: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [seoKeywords, setSeoKeywords] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [listStyle, setListStyle] = useState<'bullets' | 'numbered'>('bullets');
  const [fontSize, setFontSize] = useState<string>('base');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<ProductDescription | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [displayedHistoryCount, setDisplayedHistoryCount] = useState<number>(INITIAL_HISTORY_DISPLAY);
  
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        const parsedHistory: HistoryItem[] = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        if (parsedHistory.length > PAGINATION_THRESHOLD) {
            setDisplayedHistoryCount(INITIAL_HISTORY_DISPLAY);
        } else {
            setDisplayedHistoryCount(parsedHistory.length);
        }
      }
      const storedFontSize = localStorage.getItem(FONT_SIZE_KEY);
      if (storedFontSize && FONT_SIZES.includes(storedFontSize)) {
        setFontSize(storedFontSize);
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    const limitedHistory = newHistory.slice(0, MAX_HISTORY_STORAGE);
    setHistory(limitedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    return limitedHistory;
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
  };

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
      const result = await generateDescription(productName, additionalInfo, customInstructions, seoKeywords, listStyle);
      setDescription(result.description);
      setSources(result.sources);

      const newItem: HistoryItem = {
        id: new Date().toISOString(),
        productName,
        description: result.description,
        sources: result.sources,
        listStyle,
      };
      
      const newHistory = updateHistory([newItem, ...history]);
      
      if (newHistory.length > PAGINATION_THRESHOLD) {
        setDisplayedHistoryCount(INITIAL_HISTORY_DISPLAY);
      } else {
        setDisplayedHistoryCount(newHistory.length);
      }

    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar a descrição. Verifique o console para mais detalhes ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [productName, additionalInfo, customInstructions, seoKeywords, listStyle, history]);

  const handleViewHistoryItem = (item: HistoryItem) => {
    setDescription(item.description);
    setSources(item.sources);
    setListStyle(item.listStyle);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };
  
  const handleDeleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    const updatedHistory = updateHistory(newHistory);
    
    if (updatedHistory.length <= PAGINATION_THRESHOLD) {
      setDisplayedHistoryCount(updatedHistory.length);
    } else {
      setDisplayedHistoryCount(prevCount => Math.min(prevCount, updatedHistory.length));
    }
  };
  
  const handleClearHistory = () => {
    updateHistory([]);
    setDisplayedHistoryCount(0);
  };

  const handleLoadMoreHistory = () => {
    setDisplayedHistoryCount(prevCount => Math.min(prevCount + 5, history.length));
  };

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
              <div>
                <label htmlFor="seoKeywords" className="block text-sm font-medium text-slate-200 mb-2">
                  Palavras-chave SEO (Opcional)
                </label>
                <input
                  id="seoKeywords"
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="Ex: corrida, leve, amortecimento, maratona"
                  className="w-full bg-[#1a3a69] border border-blue-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffe600] transition-shadow duration-300"
                />
              </div>
              <div>
                <label htmlFor="customInstructions" className="block text-sm font-medium text-slate-200 mb-2">
                  Instruções Específicas (Opcional)
                </label>
                <textarea
                  id="customInstructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Usar um tom de voz divertido, focar na durabilidade, não mencionar a concorrência"
                  rows={3}
                  className="w-full bg-[#1a3a69] border border-blue-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffe600] transition-shadow duration-300"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Formato da Lista
                  </label>
                  <div className="flex items-center space-x-6 bg-[#1a3a69] border border-blue-700 rounded-lg px-4 py-3 h-full">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="listStyle"
                        value="bullets"
                        checked={listStyle === 'bullets'}
                        onChange={() => setListStyle('bullets')}
                        className="h-4 w-4 text-[#ffe600] bg-[#0c2749] border-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a3a69] focus:ring-[#ffe600]"
                      />
                      <span className="ml-2 text-slate-200">Marcadores</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="listStyle"
                        value="numbered"
                        checked={listStyle === 'numbered'}
                        onChange={() => setListStyle('numbered')}
                        className="h-4 w-4 text-[#ffe600] bg-[#0c2749] border-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a3a69] focus:ring-[#ffe600]"
                      />
                      <span className="ml-2 text-slate-200">Numerada</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="fontSizeSlider" className="block text-sm font-medium text-slate-200 mb-2">
                    Tamanho da Fonte
                  </label>
                  <div className="bg-[#1a3a69] border border-blue-700 rounded-lg px-4 py-3 h-full flex items-center">
                    <span className="text-xs mr-3">A</span>
                    <input
                      id="fontSizeSlider"
                      type="range"
                      min="0"
                      max={FONT_SIZES.length - 1}
                      value={FONT_SIZES.indexOf(fontSize)}
                      onChange={(e) => handleFontSizeChange(FONT_SIZES[parseInt(e.target.value, 10)])}
                      className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <span className="text-xl ml-3">A</span>
                  </div>
                </div>
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
          
          {history.length > 0 && (
            <div className="mt-10">
              <HistoryDisplay 
                history={history.slice(0, displayedHistoryCount)}
                totalHistoryCount={history.length}
                displayedCount={displayedHistoryCount}
                onView={handleViewHistoryItem}
                onDelete={handleDeleteHistoryItem}
                onClear={handleClearHistory}
                onLoadMore={handleLoadMoreHistory}
              />
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {description && (
            <div className="mt-10">
              <ProductDescriptionDisplay description={description} sources={sources} listStyle={listStyle} fontSize={fontSize} />
            </div>
          )}
        </main>
      </div>
       <style>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ffe600;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s ease-in-out;
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #ffe600;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: background 0.3s ease-in-out;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          background: #ffff33;
        }
        .slider-thumb::-moz-range-thumb:hover {
          background: #ffff33;
        }
      `}</style>
    </div>
  );
};

export default App;
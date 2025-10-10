import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import ClipboardCopyButton from './ClipboardCopyButton';

interface HistoryDisplayProps {
  history: HistoryItem[];
  totalHistoryCount: number;
  displayedCount: number;
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onLoadMore: () => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ 
  history, 
  totalHistoryCount,
  displayedCount,
  onView, 
  onDelete, 
  onClear,
  onLoadMore 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const productNameMatch = item.productName.toLowerCase().includes(lowercasedSearchTerm);
    const dateMatch = new Date(item.id).toLocaleString().includes(lowercasedSearchTerm);
    return productNameMatch || dateMatch;
  });

  return (
    <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-800 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-[#ffe600] w-full sm:w-auto text-center sm:text-left">Histórico de Descrições</h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Pesquisar no histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto bg-[#1a3a69] border border-blue-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ffe600] transition-shadow duration-300"
          />
          <button
            onClick={onClear}
            className="text-sm bg-red-800/60 text-red-200 px-3 py-1.5 rounded-md hover:bg-red-700/60 transition-colors flex-shrink-0"
            title="Limpar todo o histórico"
          >
            Limpar
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a3a69]/60 p-3 rounded-lg flex justify-between items-center animate-fade-in"
            >
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-slate-100 truncate pr-2" title={item.productName}>
                  {item.productName}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(item.id).toLocaleString()}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => onView(item)}
                  className="p-2 text-slate-300 hover:text-white transition-colors"
                  aria-label="Visualizar"
                  title="Visualizar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.27 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="relative" title="Copiar JSON">
                  <ClipboardCopyButton textToCopy={JSON.stringify(item.description, null, 2)} />
                </div>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Excluir"
                  title="Excluir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 py-4">Nenhum item encontrado.</p>
        )}
      </div>
      {searchTerm === '' && displayedCount < totalHistoryCount && (
        <div className="mt-4 text-center">
          <button
            onClick={onLoadMore}
            className="bg-blue-700 hover:bg-blue-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
          >
            Carregar Mais ({totalHistoryCount - displayedCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryDisplay;
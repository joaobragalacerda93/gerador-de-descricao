
import React, { useState } from 'react';

interface ClipboardCopyButtonProps {
  textToCopy: string;
}

const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // Reverte o ícone mais rápido
    });
  };

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied}
      className="absolute top-0 right-0 p-2 text-slate-400 hover:text-white transition-all duration-200 disabled:cursor-default"
      aria-label="Copiar para a área de transferência"
    >
      {isCopied ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-green-400 transform scale-110 transition-transform duration-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

export default ClipboardCopyButton;

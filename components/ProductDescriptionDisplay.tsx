
import React from 'react';
import type { ProductDescription, Source } from '../types';
import ClipboardCopyButton from './ClipboardCopyButton';

interface ProductDescriptionDisplayProps {
  description: ProductDescription;
  sources: Source[];
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
    <h2 className="text-2xl font-bold mb-4 text-purple-300 flex items-center">
      <span className="mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      {title}
    </h2>
    <div className="text-slate-200 space-y-3">{children}</div>
  </div>
);

const ProductDescriptionDisplay: React.FC<ProductDescriptionDisplayProps> = ({ description, sources }) => {
  const { title, catchyPhrase, detailedDescription, features, technicalSpecifications, faq } = description;

  return (
    <div className="animate-fade-in">
      <Section title="Título e Slogan">
        <div className="relative">
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 pr-12">{title}</h3>
          <ClipboardCopyButton textToCopy={title} />
        </div>
        <div className="relative mt-2">
          <p className="text-lg italic text-pink-300 pr-12">"{catchyPhrase}"</p>
          <ClipboardCopyButton textToCopy={catchyPhrase} />
        </div>
      </Section>
      
      <Section title="Descrição Detalhada">
         <div className="relative">
            <p className="whitespace-pre-wrap leading-relaxed pr-12">{detailedDescription}</p>
            <ClipboardCopyButton textToCopy={detailedDescription} />
        </div>
      </Section>

      <Section title="Principais Características e Benefícios">
        <ul className="list-none space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start relative pr-12">
              <span className="text-green-400 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              <span>{feature}</span>
              <ClipboardCopyButton textToCopy={feature} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Especificações Técnicas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(technicalSpecifications).map(([key, value]) => (
            <div key={key} className="bg-slate-700/50 p-3 rounded-lg">
              <strong className="text-slate-300">{key}:</strong> <span className="text-white">{value}</span>
            </div>
          ))}
        </div>
      </Section>
      
      <Section title="Perguntas Frequentes (FAQ)">
        <div className="space-y-4">
          {faq.map((item, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-lg">{item.question}</h4>
              <p className="mt-1 text-slate-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {sources && sources.length > 0 && (
        <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Fontes Utilizadas</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {sources.map((source, index) => (
                    <a 
                        key={index}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-slate-700 text-purple-300 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors"
                    >
                        {source.web.title || new URL(source.web.uri).hostname}
                    </a>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionDisplay;

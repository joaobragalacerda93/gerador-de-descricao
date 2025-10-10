export interface ProductDescription {
  title: string;
  catchyPhrase: string;
  targetAudience: string;
  detailedDescription: string;
  features: string[];
  technicalSpecifications: { [key: string]: string };
  faq: { question: string; answer: string }[];
}

export interface Source {
  web: {
    uri: string;
    title: string;
  };
}

export interface HistoryItem {
  id: string;
  productName: string;
  description: ProductDescription;
  sources: Source[];
  listStyle: 'bullets' | 'numbered';
}

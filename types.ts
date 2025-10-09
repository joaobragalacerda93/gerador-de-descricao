
export interface ProductDescription {
  title: string;
  catchyPhrase: string;
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

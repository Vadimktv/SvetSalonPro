export type Service = {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  duration: number;
  category: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  highlight: string;
  description: string;
  services: Service[];
};

export type Master = {
  id: string;
  name: string;
  role: string;
  experience: string;
  description: string;
  specialties: string[];
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  source: string;
  text: string;
  date: string;
};

export type TimeSlot = {
  value: string;
  label: string;
};

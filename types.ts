
export type Category = 'Plain' | 'Roasted' | 'Flavored' | 'Gift Packs' | 'Bulk';

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  weight: string;
  image: string;
  rating: number;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    image: string;
    createdAt: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    phone: string;
    address: string;
    createdAt: string;
  }
  
  export interface ProductFormData {
    name: string;
    price: number;
    description: string;
    category: string;
  }
  
  export interface UserFormData {
    name: string;
    email: string;
    role: string;
    phone: string;
    address: string;
  }
  
  export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'home' | 'sports' | 'all';
  
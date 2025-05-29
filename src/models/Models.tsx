// Type tanımları
export interface ProductImage {
  id?: number;
  productId: number;
  imageUrl: string;
  width?: number;
  height?: number;
  fileSizeKb?: number;
  createdAt?: string;
  publicId?: string; 
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id?: number;
  name: string;
  code?: string;
  description?: string;
  barcode?: string;
  categoryId?: number;
  price?: number;
  buyingPrice?: number;
  publish?: number;
  category?: Category;
  images?: ProductImage[];
}

export interface DealerRegisterDto {
  // Customer
  name: string;
  title: string;
  phone: string;
  address: string;
  balance?: number; // optional; default 0
  notes?: string;
  taxOffice?: string;
  taxValue?: string;

  // User
  username: string;
  password: string;
}

export interface DealerRegisterResponse {
  message: string;
  customerId: number;
  userId: number;
}

export interface User {
  id?: number; 
  username: string;
  role?: 'admin' | 'editor' | 'dealer';
  passwordHash: string;
  isActive?: boolean;
  customerId?: number; // optional for admin and editor
}

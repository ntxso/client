// Type tanımları
export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  width: number;
  height: number;
  fileSizeKb: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  barcode: string;
  categoryId: number;
  price: number;
  publish: number;
  category: Category;
  images: ProductImage[];
}
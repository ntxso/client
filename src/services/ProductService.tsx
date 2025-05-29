// src/services/productService.ts
import axios from 'axios';
import type { Product } from '../models/Models';

// API base URL
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;


// ProductService.ts
export const deleteProductImage = async (imageId: number) => {
  // Resim silme işlemi için API çağrısı
  try {
    await axios.delete(`${API_BASE_URL}/ProductImages/${imageId}`);
  } catch (error) {
    console.error(`Ürün silinirken hata oluştu (ID: ${imageId}):`, error);
    throw error;
  }
};

// Tüm ürünleri getirme
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_BASE_URL}/Products`);
    return response.data;
  } catch (error) {
    console.error('Ürünler getirilirken hata oluştu:', error);
    throw error;
  }
};

// Kategoriye göre ürün getirme
export const getProductsCategoryId = async (id: number): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_BASE_URL}/Products/search?categoryId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Ürünler getirilirken hata oluştu:', error);
    throw error;
  }
};
// ID'ye göre tek ürün getirme
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_BASE_URL}/Products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ürün getirilirken hata oluştu (ID: ${id}):`, error);
    throw error;
  }
};

// Yeni ürün ekleme
export const addProduct = async (product: Omit<Product, 'id' | 'category' | 'images'>): Promise<Product> => {
  try {
    const response = await axios.post<Product>(`${API_BASE_URL}/Products`, product);
    return response.data;
  } catch (error) {
    console.error('Ürün eklenirken hata oluştu:', error);
    throw error;
  }
};

// Ürün güncelleme
export const updateProduct = async (id: number, product: Partial<Product>): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/Products/${id}`, product);
  } catch (error) {
    console.error(`Ürün güncellenirken hata oluştu (ID: ${id}):`, error);
    throw error;
  }
};

// Ürün silme
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/Products/${id}`);
  } catch (error) {
    console.error(`Ürün silinirken hata oluştu (ID: ${id}):`, error);
    throw error;
  }
};


// Ürün resmi yükleme
export const uploadProductImage = async (productId: number, imageFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    await axios.post(
      `${API_BASE_URL}/ProductImages/upload?productId=${productId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  } catch (error) {
    console.error('Resim yüklenirken hata:', error);
    throw error;
  }
};
// src/services/productService.ts
import axios from 'axios';
import type { Product } from '../models/Models';

// API base URL
const API_BASE_URL = 'https://localhost:7096/api';



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
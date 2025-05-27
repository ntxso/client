import axios from 'axios';
import type { DealerRegisterDto, DealerRegisterResponse } from '../models/Models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Customer {
  id?: string; // Optional for create operations
  name: string;
  title: string;
  phone: string;
  address: string;
  balance: number;
  notes: string;
  taxOffice?: string;
  taxValue?: string;
}

class CustomerService {
  private static instance: CustomerService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/Customers`;
  }

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      const response = await axios.post<Customer>(this.baseUrl, customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await axios.get<Customer[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await axios.get<Customer>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  }

  async updateCustomer(id: string, customer: Customer): Promise<Customer> {
    try {
      const response = await axios.put<Customer>(`${this.baseUrl}/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  }

  async registerDealer(data: DealerRegisterDto): Promise<DealerRegisterResponse> {
    try {
      const response = await axios.post<DealerRegisterResponse>(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      console.error('Error registering dealer:', error);
      throw error;
    }
  }
}

export default CustomerService.getInstance();
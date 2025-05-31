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
      const response = await axios.post<Customer>(`${this.baseUrl}/Update/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/Delete/${id}`);
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  }

  async registerDealer(data: DealerRegisterDto): Promise<DealerRegisterResponse> {
    try {
      const response = await axios.post<DealerRegisterResponse>(`${API_BASE_URL}/auth/register`, data);
      return response.data; f
    } catch (error) {

      console.error('Error registering dealer:', error);
      throw error;
    }
  }

  async sendVerificatioCode(email: string): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/verification/send-verification-code`, { email: email, name: "testtt" })
      console.log(JSON.stringify(response.data));
      console.log(email)
    } catch (error) {
      console.error(error);
      throw (error);
    }
  }

  async verificationCode(email: string, code: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/verification/verify-code`, { email: email, code: code })
    }
    catch (err) {
      console.error(JSON.stringify(err))
      throw (err)
    }
  }
}

export default CustomerService.getInstance();
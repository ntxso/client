// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Token varsa axios header'ına ekle
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://localhost:7096/api/Auth/login', {
        username,
        password
      });
      
      const receivedToken = response.data.token; // API'nizin token dönüş yapısına göre ayarlayın
      setToken(receivedToken);
      navigate('/'); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Hata yakalamak için
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { extractRoleFromToken } from '../utils/jwt';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  role: 'admin' | 'editor' | 'dealer' | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<'Admin' | 'Editor' | 'Dealer' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const roleClaim = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      setRole(roleClaim || null);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setRole(null);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://localhost:7096/api/Auth/login', {
        username,
        password
      });

      const receivedToken = response.data.token;
      setToken(receivedToken);
      setRole(extractRoleFromToken(receivedToken));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  const value: AuthContextType = {
    token,
    role,
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

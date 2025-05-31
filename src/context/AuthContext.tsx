// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { extractRoleFromToken } from '../utils/jwt';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../models/Models'; // User tipini doğru şekilde import ettiğinizden emin olun

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  user: User | null; // Bu zaten doğru
  token: string | null;
  role: 'admin' | 'editor' | 'dealer' | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<'admin' | 'editor' | 'dealer' | null>(null);
  // YENİ EKLENEN SATIR: user durumunu tanımlayın
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const roleClaim = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (typeof roleClaim === 'string') {
          const normalizedRole = roleClaim.toLowerCase();
          if (normalizedRole === 'admin' || normalizedRole === 'editor' || normalizedRole === 'dealer') {
              setRole(normalizedRole as 'admin' | 'editor' | 'dealer');
          } else {
              console.warn('Beklenmeyen rol değeri geldi:', roleClaim);
              setRole(null);
          }
      } else {
          setRole(null);
      }

      // KULLANICI BİLGİSİNİ AYARLAMA (Örnek)
      // Eğer JWT içinde kullanıcı bilgisi (örneğin sub alanı id ise) veya
      // API login yanıtında user objesi geliyorsa, burada setUser ile ayarlamanız gerekir.
      // Şimdilik sadece hatayı gidermek için null olarak bırakabiliriz,
      // ancak gerçek bir User objesi ayarlamanız gerektiğini unutmayın.
      // Örneğin: setUser({ id: decoded.sub, username: decoded.username }); // Bu, JWT içindeki bilgilere bağlı
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setRole(null);
      setUser(null); // Çıkış yapıldığında kullanıcıyı da sıfırlayın
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
        email,
        password
      });

      const receivedToken = response.data.token;
      setToken(receivedToken);
      setRole(extractRoleFromToken(receivedToken));
      // KULLANICI BİLGİSİNİ AYARLAMA:
      // Eğer API yanıtında User objesi geliyorsa:
      // setUser(response.data.user);
      // Veya JWT'den kullanıcı adı gibi bilgileri alıyorsanız:
      // const decoded: any = jwtDecode(receivedToken);
      // setUser({ id: decoded.sub, username: decoded.username }); // Örnek
      // Şimdilik sadece hatayı gidermek için, eğer login API'si user döndürmüyorsa
      // burayı boş bırakın veya null olarak ayarlayın, ama gerçekte
      // user objesini burada doldurmanız gerekecek.
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null); // Çıkış yapıldığında kullanıcıyı da sıfırlayın
    navigate('/login');
  };

  const value: AuthContextType = {
    user, // EKLENEN SATIR: user durumunu buraya dahil edin
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
// utils/jwt.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: 'Admin' | 'Editor' | 'Dealer';
  [key: string]: any;
}

export const extractRoleFromToken = (token: string): 'Admin' | 'Editor' | 'Dealer' | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role ?? null;
  } catch (e) {
    console.error('Token decode hatası:', e);
    return null;
  }
};

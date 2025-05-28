// utils/jwt.ts
import { jwtDecode } from "jwt-decode";

// JWT token içindeki 'role' değerlerinin gerçekte nasıl geldiğine göre tipi düzeltin
interface JwtPayload {
  sub: string;
  // Rollerin gerçekten büyük harfle başladığını varsayarak
  role: 'Admin' | 'Editor' | 'Dealer'; // <-- Burayı düzeltiyoruz!
  [key: string]: any;
}

export const extractRoleFromToken = (token: string): 'admin' | 'editor' | 'dealer' | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Şimdi, decoded.role 'Admin' veya 'Editor' gibi gelecek.
    // Bizim AuthContextType'ımız ise küçük harfli 'admin' bekliyor.
    // Bu yüzden burada küçük harfe dönüştürme yapmalıyız.
    const normalizedRole = decoded.role.toLowerCase();

    // TypeScript'e bu dönüştürülmüş rolün beklenen tiplerden biri olduğunu söyleyelim.
    // Bu 'as' ataması, kodun güvenli olduğunu varsayar. Eğer JWT'den beklenmedik bir rol geliyorsa
    // daha dikkatli bir kontrol gerekebilir.
    if (normalizedRole === 'admin' || normalizedRole === 'editor' || normalizedRole === 'dealer') {
        return normalizedRole as 'admin' | 'editor' | 'dealer';
    } else {
        console.warn('Beklenmeyen rol değeri geldi:', decoded.role);
        return null; // Veya varsayılan bir rol döndür
    }

  } catch (e) {
    console.error('Token decode hatası:', e);
    return null;
  }
};

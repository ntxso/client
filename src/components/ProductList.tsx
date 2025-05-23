// src/components/ProductList.tsx
import { useState, useEffect } from 'react';
import { getProducts } from '../services/ProductService';
import { useAuth } from '../context/AuthContext'; // Auth context'iniz
import type { Product } from '../models/Models';

interface ProductCardProps {
  product: Product;
  isAuthenticated: boolean;
}

const ProductCard = ({ product, isAuthenticated }: ProductCardProps) => (
  <div className="border p-4 rounded shadow">
    <h3 className="font-bold text-lg">{product.name}</h3>
    <p>{product.description}</p>
    {isAuthenticated && (
      <p className="font-bold mt-2">Fiyat: ${product.price}</p>
    )}
    {product.images.length > 0 && (
      <img 
        src={product.images[0].imageUrl} 
        alt={product.name}
        className="mt-2 w-full h-32 object-contain"
      />
    )}
  </div>
);

const ProductList = () => {
  const { isAuthenticated } = useAuth(); // Auth durumunu al
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {isAuthenticated ? 'Tüm Ürünler' : 'Ürün Kataloğu'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
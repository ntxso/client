// src/pages/ProductDetail.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  code: string;
  price: number;
  images: {
    id: number;
    imageUrl: string;
  }[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    axios.get(`https://localhost:7096/api/Products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Ürün alınamadı:', err));
  }, [id]);

  if (!product) return <p>Yükleniyor...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-2">Kod: {product.code}</p>
      <div className="flex gap-2 overflow-x-auto mb-4">
        {product.images.map(image => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt="Ürün görseli"
            className="w-32 h-32 object-cover rounded border"
          />
        ))}
      </div>
      <p className="mb-4">{product.description}</p>
      {isAuthenticated && (
        <p className="text-lg font-semibold text-green-700">
          Fiyat: ₺{product.price.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default ProductDetail;

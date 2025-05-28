import { useParams } from 'react-router-dom';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../models/Models';
import { getProductById, uploadProductImage } from '../services/ProductService';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { isAuthenticated, role } = useAuth(); // ← burası güncellendi

  const isAdmin = role === 'admin'; // ← büyük/küçük harf farkına dikkat!

  const fetchProduct = async () => {
    try {
      const res = await getProductById(Number(id));
      setProduct(res);
    } catch (err) {
      console.error('Ürün alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewImages(fileArray);
      setPreviewUrls(fileArray.map(file => URL.createObjectURL(file)));
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsUploading(true);
    try {
      for (const image of newImages) {
        await uploadProductImage(product.id ?? 0, image);
      }

      alert('Görseller yüklendi!');
      setNewImages([]);
      setPreviewUrls([]);
      fetchProduct();
    } catch (err) {
      console.error('Yükleme hatası:', err);
      alert('Görsel yüklenirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!product) return <p>Yükleniyor...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-2">Kod: {product.code}</p>

      <div className="flex gap-2 overflow-x-auto mb-4">
        {product.images?.map(image => (
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
          Fiyat: ₺{product.price?.toFixed(2)}
        </p>
      )}

      {isAdmin && (
        <form onSubmit={handleUpload} className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Yeni Görsel Ekle</h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mb-2"
          />
          {previewUrls.length > 0 && (
            <div className="flex gap-2 mb-2">
              {previewUrls.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover border rounded"
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isUploading ? 'Yükleniyor...' : 'Görselleri Yükle'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductDetail;

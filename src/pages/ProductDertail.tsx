import { useParams } from 'react-router-dom';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../models/Models';
import { Link } from 'react-router-dom';
import { getProductById, uploadProductImage, deleteProductImage, deleteProduct } from '../services/ProductService';

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
  const handleDeleteImage = async (imageId: number) => {
    const confirmed = window.confirm('Bu görseli silmek istediğinize emin misiniz?');

    if (!confirmed) return;

    try {
      await deleteProductImage(imageId);
      alert('Görsel silindi.');
      fetchProduct(); // yeniden yükle
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Görsel silinirken bir hata oluştu.');
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {product.images?.map(image => (
          <div key={image.id} className="relative">
            <img
              src={image.imageUrl}
              alt="Ürün görseli"
              className="object-cover w-full rounded border"
            />
            {isAdmin && (
              <button
                onClick={() => handleDeleteImage(image.id ?? 0)}
                className="absolute bottom-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
              >
                Sil
              </button>
            )}
          </div>
        ))}
      </div>


      <p className="mb-4">{product.description}</p>

      {isAuthenticated && (
        <p className="text-lg font-semibold text-green-700">
          Fiyat: ${product.price?.toFixed(2)}
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

      {isAdmin && (
        <div className="mt-6 flex gap-4">
          <Link
            to={`/product/edit/${product.id}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Düzenle
          </Link>
          <button
            onClick={async () => {
              const confirmed = window.confirm('Bu ürünü silmek istediğinizden emin misiniz?');
              if (!confirmed) return;

              try {
                await deleteProduct(product.id ?? 0);
                alert('Ürün silindi.');
                // yönlendirme
                window.location.href = '/'; // varsayılan admin ürün listesi
              } catch (err) {
                console.error('Ürün silme hatası:', err);
                alert('Ürün silinirken hata oluştu.');
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Ürünü Sil
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;

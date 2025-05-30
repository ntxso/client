import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, deleteProduct } from '../services/ProductService';
import type { Product } from '../models/Models';
import categoriesData from '../data/categories.json';

const ProductEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Partial<Product>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProductById(Number(id));
                setProduct(res);
            } catch (err) {
                console.error('Ürün getirilemedi:', err);
                alert('Ürün bilgileri alınırken hata oluştu.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'buyingPrice' || name === 'categoryId' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            setIsSaving(true);

            // Sunucunun beklediği alanları ayıkla
            const cleanProduct = {
                id: Number(id),
                name: product.name,
                code: product.code,
                description: product.description,
                barcode: product.barcode,
                categoryId: product.categoryId,
                price: product.price,
                buyingPrice: product.buyingPrice,
            };

            await updateProduct(Number(id), cleanProduct);
            alert('Ürün başarıyla güncellendi.');
            navigate(`/products/${id}`);
        } catch (err) {
            alert('Güncelleme başarısız.');
        } finally {
            setIsSaving(false);
        }
    };


    const handleDelete = async () => {
        if (!id) return;
        const confirmDelete = window.confirm('Bu ürünü silmek istediğinize emin misiniz?');
        if (!confirmDelete) return;

        try {
            await deleteProduct(Number(id));
            alert('Ürün silindi.');
            navigate('/products'); // ürün listesine geri dön
        } catch (err) {
            alert('Silme işlemi başarısız.');
        }
    };

    if (isLoading) return <p>Yükleniyor...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Ürünü Güncelle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={product.name ?? ''} onChange={handleChange} placeholder="Ürün Adı" required className="w-full border px-3 py-2 rounded" />
                <input name="code" value={product.code ?? ''} onChange={handleChange} placeholder="Ürün Kodu" className="w-full border px-3 py-2 rounded" />
                <input name="barcode" value={product.barcode ?? ''} onChange={handleChange} placeholder="Barkod" className="w-full border px-3 py-2 rounded" />
                <textarea name="description" value={product.description ?? ''} onChange={handleChange} placeholder="Açıklama" rows={4} className="w-full border px-3 py-2 rounded" />
                <select name="categoryId" value={product.categoryId ?? ''} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                    <option value="">Kategori Seçin</option>
                    {categoriesData.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input type="number" name="price" value={product.price ?? ''} onChange={handleChange} placeholder="Satış Fiyatı" className="w-full border px-3 py-2 rounded" />
                <input type="number" name="buyingPrice" value={product.buyingPrice ?? ''} onChange={handleChange} placeholder="Alış Fiyatı" className="w-full border px-3 py-2 rounded" />

                <div className="flex gap-4">
                    <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50">
                        {isSaving ? 'Kaydediliyor...' : 'Güncelle'}
                    </button>
                    <button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        Sil
                    </button>
                    <button type="button" onClick={()=>{ navigate(`/products/${id}`);}} className="bg-gray-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        Vazgeç
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductEdit;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // kendi yoluna göre ayarla
import { getProductsCategoryId } from "../services/ProductService";
import type { Product } from '../models/Models';

// type Product = {
//     id: number;
//     name: string;
//     code: string;
//     imageUrl?: string;
//     price: number;
//     categoryId: number;
//     images: { imageUrl: string }[];
// };

const ProductsByCategory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth(); // auth kontrolü

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductsCategoryId(Number(id));
                setProducts(response);
            } catch (error) {
                console.error("Ürünler alınırken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    if (loading) return <div className="p-4">Yükleniyor...</div>;

    if (products.length === 0)
        return <div className="p-4">Bu kategoride ürün bulunamadı.</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Kategoriye Ait Ürünler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Link
                        to={`/products/${product.id}`}
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition block"
                    >{(product.images??[]).length > 0 && (<img
                        src={(product.images??[])[0].imageUrl || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded mb-2"
                    />)}

                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">Kod: {product.code}</p>
                        {isAuthenticated && (
                            <p className="text-blue-600 font-bold">{product.price} ₺</p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductsByCategory;

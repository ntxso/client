// src/pages/BulkUpload.tsx
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Product {
    name: string;
    code?: string;
    description?: string;
    barcode?: string;
    categoryId?: number;
    price?: number;
    publish?: number;
}

const BulkUpload = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target?.result;
            if (data) {
                const workbook = XLSX.read(data, { type: 'array' }); // 'binary' yerine 'array'
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData: Product[] = XLSX.utils.sheet_to_json(sheet);
                setProducts(jsonData);
            }
        };
        reader.readAsArrayBuffer(file); // modern kullanım

    };

    const handleUpload = async () => {
        // console.log(products);
        try {
            for (const product of products) {
                await axios.post(`${API_BASE_URL}/Products`, product);
            }
            alert('Tüm ürünler başarıyla yüklendi!');
            setProducts([]);
        } catch (err) {
            console.error(err);
            alert('Yükleme sırasında hata oluştu.');
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Excel'den Toplu Ürün Yükle</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {products.length > 0 && (
                <>
                    <div className="mt-4">
                        <p className="font-semibold">Yüklenecek Ürün Sayısı: {products.length}</p>
                        <button
                            onClick={handleUpload}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Ürünleri Gönder
                        </button>
                    </div>
                    <ul className="mt-4 max-h-64 overflow-y-auto border p-2 rounded">
                        {products.map((p, i) => (
                            <li key={i} className="text-sm">
                                {p.name} - {p.code} - {p.price}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default BulkUpload;

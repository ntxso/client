// src/components/ProductForm.tsx

import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import categoriesData from '../data/categories.json'
import { addProduct, uploadProductImage } from '../services/ProductService'

interface Product {
  name: string
  description: string
  price: number
  code: string
  categoryId: number
  images: File[]
}

interface Category {
  id: number
  name: string
}

const ProductForm = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    code: '',
    categoryId: 0,
    images: [],
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setCategories(categoriesData)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'categoryId' ? Number(value) : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setProduct(prev => ({ ...prev, images: fileArray }))
      setImagePreviews(fileArray.map(file => URL.createObjectURL(file)))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Görselleri hariç tutarak ürünü kaydet
      const { images, ...productData } = product

      const newProduct = await addProduct(productData)

      // Görselleri yükle
      for (const image of images) {
        await uploadProductImage(newProduct.id, image)
      }

      alert('Ürün ve görseller başarıyla yüklendi.')

      // Formu sıfırla
      setProduct({ name: '', description: '', price: 0, code: '', categoryId: 0, images: [] })
      setImagePreviews([])
    } catch (error) {
      console.error('Ürün gönderimi sırasında hata oluştu:', error)
      alert('Ürün gönderimi sırasında bir hata oluştu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>

      <div>
        <label className="block font-medium">Ürün Adı</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Kod</label>
        <input
          type="text"
          name="code"
          value={product.code}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Kategori</label>
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Kategori seçin</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Açıklama</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Fiyat</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Görseller</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
      </div>

      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {imagePreviews.map((src, index) => (
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
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Yükleniyor...' : 'Kaydet'}
      </button>
    </form>
  )
}

export default ProductForm

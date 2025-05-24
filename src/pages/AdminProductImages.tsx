import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

interface ProductImage {
  id: number
  imageUrl: string
}

interface Product {
  id: number
  name: string
  description: string
  code: string
  price: number
  images: ProductImage[]
}

const AdminProductImages = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [newImages, setNewImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    axios.get(`https://localhost:7096/api/Products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Ürün getirilemedi:", err))
  }, [id])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setNewImages(fileArray)
      setPreviews(fileArray.map(file => URL.createObjectURL(file)))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return

    setIsSubmitting(true)
    try {
      for (const file of newImages) {
        const formData = new FormData()
        formData.append("file", file)
        await axios.post(`https://localhost:7096/api/ProductImages/upload?productId=${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }
      alert("Görseller yüklendi!")
      setNewImages([])
      setPreviews([])
      // Ürünü tekrar getir
      const updated = await axios.get(`https://localhost:7096/api/Products/${id}`)
      setProduct(updated.data)
    } catch (err) {
      console.error("Yükleme hatası:", err)
      alert("Görsel yüklenirken hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) return <p>Yükleniyor...</p>
  if (!isAdmin) return <p className="text-red-600 text-center mt-8">Bu sayfaya sadece admin erişebilir.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-4">{product.name} - Görsel Yönetimi</h1>
      <p className="mb-2">Kod: <strong>{product.code}</strong></p>
      <p className="mb-4">{product.description}</p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Mevcut Görseller</h2>
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map(image => (
            <img key={image.id} src={image.imageUrl} alt="Görsel" className="w-28 h-28 object-cover rounded border" />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Yeni Görseller Ekle</h2>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="block"
        />

        {previews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {previews.map((src, idx) => (
              <img key={idx} src={src} className="w-24 h-24 object-cover rounded border" alt={`Preview ${idx}`} />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Yükleniyor..." : "Görselleri Yükle"}
        </button>
      </form>
    </div>
  )
}

export default AdminProductImages

// import { useState, ChangeEvent, FormEvent } from 'react'

// interface Product {
//   name: string
//   description: string
//   price: number
//   images: File[]
// }

// const ProductForm = () => {
//   const [product, setProduct] = useState<Product>({
//     name: '',
//     description: '',
//     price: 0,
//     images: [],
//   })

//   const [imagePreviews, setImagePreviews] = useState<string[]>([])

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setProduct(prev => ({
//       ...prev,
//       [name]: name === 'price' ? parseFloat(value) : value,
//     }))
//   }

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (files) {
//       const fileArray = Array.from(files)
//       setProduct(prev => ({ ...prev, images: fileArray }))

//       // Görsel önizleme
//       const previews = fileArray.map(file => URL.createObjectURL(file))
//       setImagePreviews(previews)
//     }
//   }

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault()

//     // Geçici olarak sadece console'a yaz
//     console.log('Ürün:', product)

//     // TODO: API'ye gönderim / Cloudinary entegrasyonu

//     alert('Ürün gönderildi (henüz backend bağlantısı yapılmadı)')
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto mt-8">
//       <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>

//       <div>
//         <label className="block font-medium">Ürün Adı</label>
//         <input
//           type="text"
//           name="name"
//           value={product.name}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />
//       </div>

//       <div>
//         <label className="block font-medium">Açıklama</label>
//         <textarea
//           name="description"
//           value={product.description}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />
//       </div>

//       <div>
//         <label className="block font-medium">Fiyat</label>
//         <input
//           type="number"
//           name="price"
//           value={product.price}
//           onChange={handleChange}
//           required
//           className="w-full border p-2 rounded"
//         />
//       </div>

//       <div>
//         <label className="block font-medium">Görseller</label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//           className="w-full"
//         />
//       </div>

//       {imagePreviews.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-2">
//           {imagePreviews.map((src, index) => (
//             <img
//               key={index}
//               src={src}
//               alt={`preview-${index}`}
//               className="w-24 h-24 object-cover border rounded"
//             />
//           ))}
//         </div>
//       )}

//       <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//       >
//         Kaydet
//       </button>
//     </form>
//   )
// }

// export default ProductForm

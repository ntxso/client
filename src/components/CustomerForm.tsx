import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

interface Customer {
  name: string
  title: string
  phone: string
  address: string
  balance: number
  notes: string
}

const CustomerForm = () => {
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    title: '',
    phone: '',
    address: '',
    balance: 0,
    notes: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomer(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    console.log('Müşteri:', customer)
    alert('Müşteri bilgileri kaydedildi (henüz backend bağlantısı yapılmadı)')
    
    // Formu temizle
    setCustomer({
      name: '',
      title: '',
      phone: '',
      address: '',
      balance: 0,
      notes: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Yeni Müşteri Ekle</h2>

      <div>
        <label className="block font-medium">Ad Soyad</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Ünvan</label>
        <input
          type="text"
          name="title"
          value={customer.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Telefon</label>
        <input
          type="tel"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Adres</label>
        <textarea
          name="address"
          value={customer.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Bakiye (₺)</label>
        <input
          type="number"
          name="balance"
          value={customer.balance}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Notlar</label>
        <textarea
          name="notes"
          value={customer.notes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Müşteriyi Kaydet
      </button>
    </form>
  )
}

export default CustomerForm
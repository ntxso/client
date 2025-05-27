import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CustomerService from '../services/CustomerService';
import type { Customer } from '../services/CustomerService';


const CustomerForm: React.FC = () => {
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    title: '',
    phone: '',
    address: '',
    balance: 0,
    notes: '',
    taxOffice: '',
    taxValue: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomer(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const savedCustomer = await CustomerService.createCustomer(customer);
      console.log('Kaydedilen müşteri:', savedCustomer);
      alert('Müşteri bilgileri başarıyla kaydedildi!');

      // Formu temizle
      setCustomer({
        name: '',
        title: '',
        phone: '',
        address: '',
        balance: 0,
        notes: '',
        taxOffice: '',
        taxValue: ''
      })
    } catch (error) {
      console.error('Kayıt hatası:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Yeni Müşteri Ekle</h2>

      <div>
        <label className="block font-medium">Adı Soyadı</label>
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
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Adres</label>
        <input
          type="text"
          name="address"
          value={customer.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Bakiye</label>
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
        disabled={isSubmitting}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Kayıt Ediliyor...' : 'Kaydet'}
      </button>
    </form>
  )
}

export default CustomerForm

import { useState } from 'react';
//import CustomerService, { DealerRegisterDto } from '@/services/CustomerService';
import CustomerService from '../services/CustomerService';
import type { DealerRegisterDto, DealerRegisterResponse } from '../models/Models';
import { useNavigate } from 'react-router-dom';

export default function DealerRegisterForm() {
    const navigate = useNavigate();
  const [form, setForm] = useState<DealerRegisterDto>({
    name: '',
    title: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    taxOffice: '',
    taxValue: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await CustomerService.registerDealer(form);
      setMessage(`Kayıt başarılı! Müşteri ID: ${result.customerId}, Kullanıcı ID: ${result.userId}`);
      setForm({
        name: '',
        title: '',
        phone: '',
        address: '',
        username: '',
        password: '',
        taxOffice: '',
        taxValue: '',
        notes: '',
      });
      setSuccess(true);
      // 2 saniye bekleyip login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bayi Kayıt Formu</h2>
      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Firma Adı"
            value={form.name}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="title"
            placeholder="Unvan"
            value={form.title}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="phone"
            placeholder="Telefon"
            value={form.phone}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="address"
            placeholder="Adres"
            value={form.address}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="taxOffice"
            placeholder="Vergi Dairesi"
            value={form.taxOffice}
            onChange={handleChange}
            className="input"
          />
          <input
            name="taxValue"
            placeholder="Vergi No"
            value={form.taxValue}
            onChange={handleChange}
            className="input"
          />
          <input
            name="username"
            placeholder="Kullanıcı Adı"
            value={form.username}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <textarea
          name="notes"
          placeholder="Notlar"
          value={form.notes}
          onChange={handleChange}
          className="input w-full"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydı Tamamla'}
        </button>
      </form>
      {success && (
        <p className="mt-4 text-green-600 font-medium text-center">
          Kayıt tamamlandı, giriş sayfasına yönlendiriliyorsunuz...
        </p>
      )}
    </div>
  );
}

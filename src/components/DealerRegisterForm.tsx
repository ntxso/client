import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerService from '../services/CustomerService';
import type { DealerRegisterDto } from '../models/Models';
import { SalesType } from '../models/SalesType';
import axios from 'axios';

export default function DealerRegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<DealerRegisterDto>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    cityId: 35, // İzmir
    districtId: 0,
    address: '',
    password: '',
    salesType: SalesType.None,
    verificationCode: ''
  });

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);


  useEffect(() => {
    axios.get('https://api.tekrem.com/api/cdq/getcities')
      .then(res => setCities(res.data))
      .catch(err => console.error('İller alınamadı:', err));

    axios.get('https://api.tekrem.com/api/cdq/getdistricts?cityid=35')
      .then(res => setDistricts(res.data))
      .catch(err => console.error('İzmir ilçeleri alınamadı:', err));
  }, []);

  useEffect(() => {
    if (form.cityId > 0) {
      axios.get(`https://api.tekrem.com/api/cdq/getdistricts?cityid=${form.cityId}`)
        .then(res => setDistricts(res.data))
        .catch(err => console.error('İlçeler alınamadı:', err));
    }
  }, [form.cityId]);
  const handleSalesTypeChange = (type: SalesType) => {
    setForm(prev => {
      const current = prev.salesType;
      const updated = (current & type) === type
        ? current & ~type // Seçiliyse kaldır
        : current | type; // Seçili değilse ekle
      return { ...prev, salesType: updated };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPasswordError(value.length < 6 ? "Şifre en az 6 karakter olmalıdır." : null);
    }
    setForm(prev => ({
      ...prev,
      [name]: name === "salesType" || name === "cityId" || name === "districtId" ? Number(value) : value
    }));
  };

  const sendVerificationCode = async () => {
    try {
      await CustomerService.sendVerificatioCode(form.email);
      alert('Doğrulama kodu e-posta adresinize gönderildi.');
      setCodeSent(true);
    } catch (err) {
      setError('Kod gönderilemedi.');
    }
  };

  const verifyCode = async () => {
    try {
      await CustomerService.verificationCode(form.email, form.verificationCode ?? '');
      setCodeVerified(true);
      alert('E-posta doğrulandı.');
    } catch (err) {
      setError('Doğrulama kodu geçersiz.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!codeVerified) {
      setMessage('Lütfen email hesabınızı doğrulayın');
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }
    try {
      const result = await CustomerService.registerDealer(form);
      setMessage(`Kayıt başarılı! Müşteri ID: ${result.customerId}, Kullanıcı ID: ${result.userId}`);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bayi Kayıt Formu</h2>
      {message && <div className="mb-4 text-sm text-green-600">{message}</div>}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex gap-4'>
          <input disabled={codeSent} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input flex-1" />
          <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required className="input flex-1" />
          
        </div>
        <div>{passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}</div>

        <div className="flex gap-4">
          <input name="name" placeholder="İsim" value={form.name} onChange={handleChange} required className="input flex-1" />
          <input name="companyName" placeholder="Firma İsmi" value={form.companyName} onChange={handleChange} required className="input flex-1" />
        </div>





        <div className="flex gap-4">
          <select name="cityId" value={form.cityId} onChange={handleChange} className="input flex-1" required>
            <option value="">İl Seçin</option>
            {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>

          <select name="districtId" value={form.districtId} onChange={handleChange} className="input flex-1" required>
            <option value="">İlçe Seçin</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <textarea name="address" placeholder="Adres" value={form.address} onChange={handleChange} required className="input w-full" />
        <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} required className="input flex-1" />
        <div className="flex gap-4">

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Satış Tipleri:</label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(form.salesType & SalesType.Store) !== 0}
                onChange={() => handleSalesTypeChange(SalesType.Store)}
              />
              <span>Mağaza / İşyeri</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(form.salesType & SalesType.Mobile) !== 0}
                onChange={() => handleSalesTypeChange(SalesType.Mobile)}
              />
              <span>Seyyar / Stand</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(form.salesType & SalesType.Online) !== 0}
                onChange={() => handleSalesTypeChange(SalesType.Online)}
              />
              <span>Online</span>
            </label>
          </div>

        </div>
        <div className="flex gap-2">
          <button type="button" onClick={sendVerificationCode} className="bg-gray-200 px-4 py-2 rounded-lg">Kodu Gönder</button>
          {codeSent && (
            <>
              <input placeholder="Doğrulama Kodu" value={form.verificationCode} onChange={e => setForm({ ...form, verificationCode: e.target.value })} className="input flex-1" />
              <button type="button" onClick={verifyCode} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Doğrula</button>
            </>
          )}
        </div>

        {codeVerified && (
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            {loading ? 'Kaydediliyor...' : 'Kaydı Tamamla'}
          </button>
        )}
      </form>

      {success && (
        <p className="mt-4 text-green-600 font-medium text-center">
          Kayıt tamamlandı, giriş sayfasına yönlendiriliyorsunuz...
        </p>
      )}
    </div>
  );
}

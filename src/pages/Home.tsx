import CategoryGrid from "../components/CategoryGrid";
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { role, isAuthenticated } = useAuth()

  return (
    <div>
      <div className="p-4">
      <h1 className="text-xl font-bold">Ana Sayfa</h1>
      <p>Giriş durumu: {isAuthenticated ? 'Giriş Yapıldı' : 'Misafir'}</p>
      <p>Rol: {role ?? 'Yok'}</p>
    </div>
      <h2 className="text-2xl font-semibold mb-2">Welcome to Home</h2>
      <p>This is the homepage of your app.</p>
      <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center py-6">Kategoriler</h1>
      <CategoryGrid />
    </div>
    </div>
  )
}

export default Home

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import NewProduct from './pages/NewProduct'
import CustomerForm from './components/CustomerForm'
import ProductList from './components/ProductList'
import LoginPage from './pages/Login'
import NotFoundPage from './pages/NotFoundPage' // Ekstra: 404 sayfası
import ProtectedRoutesWrapper from './components/ProtectedRoutesWrapper'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Navbar />
        <main className="p-4">
          // App.tsx içinde Routes kısmı
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutesWrapper />}>
              <Route path="/new" element={<NewProduct />} />
              <Route path="/newcust" element={<CustomerForm />} />
              <Route path="/products" element={<ProductList />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
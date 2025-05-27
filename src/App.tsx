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
import ProductDetail from './pages/ProductDertail'
import BulkUpload from './pages/BulkUpload'
import ProductsByCategory from './components/ProductsByCategory'
import DealerRegisterPage from './pages/DealerRegister'
import AdminPanel from './pages/AdminPanel'



function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Navbar />
        <main className="p-4">
          {/* // App.tsx içinde Routes kısmı */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/categoryid/:id" element={<ProductsByCategory />} />
            <Route path="/register" element={<DealerRegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutesWrapper />}>
              <Route path="/new" element={<NewProduct />} />
              <Route path="/newcust" element={<CustomerForm />} />
              <Route path="/bulk-upload" element={<BulkUpload />} />
              <Route path="/admin-panel" element={<AdminPanel />} />


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
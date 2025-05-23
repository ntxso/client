// src/components/Navbar.tsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">Ana Sayfa</Link>
          <Link to="/about" className="hover:underline">Hakkında</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/new" className="hover:underline">Yeni Ürün</Link>
              <Link to="/newcust" className="hover:underline">Yeni Müşteri</Link>
              <Link to="/products" className="hover:underline">Ürünler</Link>
            </>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
            >
              Çıkış Yap
            </button>
          ) : (
            <Link 
              to="/login"
              className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar











// import { Link } from 'react-router-dom'

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow p-4 flex justify-between items-center">
//       <h1 className="text-xl font-bold">MyApp</h1>
//       <div className="space-x-4">
//         <Link to="/" className="hover:text-blue-600">Home</Link>
//         <Link to="/about" className="hover:text-blue-600">About</Link>
//         <Link to="/new" className="hover:text-blue-600">Yeni Ürün</Link>
//          <Link to="/newcust" className="hover:text-blue-600">Müşteri Ekle</Link>

//       </div>
//     </nav>
//   )
// }

// export default Navbar

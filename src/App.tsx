import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import NewProduct from './pages/NewProduct'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/new" element={<NewProduct />} />

        </Routes>
      </main>
    </div>
  )
}

export default App

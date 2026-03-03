import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import Home from './pages/Home'
import Brands from './pages/Brands'
import BrandDetail from './pages/BrandDetail'
import CreateSong from './pages/CreateSong'
import KidsSong from './pages/KidsSong'
import RequestService from './pages/RequestService'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-black text-white antialiased">
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <CheckoutModal />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:slug" element={<BrandDetail />} />
            <Route path="/create-song" element={<CreateSong />} />
            <Route path="/kids-song" element={<KidsSong />} />
            <Route path="/request-service" element={<RequestService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App

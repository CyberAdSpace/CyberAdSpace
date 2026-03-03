import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
    <div className="min-h-screen bg-black text-white antialiased">
      <ScrollToTop />
      <Navbar />
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
  )
}

export default App

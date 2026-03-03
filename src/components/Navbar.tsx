import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, QrCode, Award } from 'lucide-react'
import { rewardsService } from '../services/rewards'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const points = rewardsService.getBalance()

  useState(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/brands', label: 'BRANDS' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-white/5' : 'bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2">
            <QrCode className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            <span className="text-lg sm:text-xl font-black tracking-wider">
              CYBER<span className="text-gray-400">AD</span>SPACE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive(link.to) ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-gray-300">{points} CP</span>
            </div>
            <Link
              to="/brands"
              className="bg-white text-black px-5 py-2 text-sm font-bold tracking-wide hover:bg-gray-200 transition-colors"
            >
              EXPLORE BRANDS
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-gray-300">{points}</span>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-white">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-lg font-medium text-gray-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/brands"
              onClick={() => setMenuOpen(false)}
              className="block bg-white text-black px-5 py-3 text-center font-bold tracking-wide"
            >
              EXPLORE BRANDS
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

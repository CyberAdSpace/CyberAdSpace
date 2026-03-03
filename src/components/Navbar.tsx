import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, QrCode, Award, ShoppingCart, Wallet, Loader2 } from 'lucide-react'
import { rewardsService } from '../services/rewards'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const points = rewardsService.getBalance()
  const { cartCount, setCartOpen, walletActor, walletConnecting, connectWallet, disconnectWallet } = useCart()

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
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-gray-300">{points} CAS</span>
            </div>
            {walletActor ? (
              <button
                onClick={disconnectWallet}
                className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full text-green-300 hover:bg-green-500/20 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span className="text-xs font-bold">{walletActor.slice(0, 8)}...</span>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                disabled={walletConnecting}
                className="flex items-center gap-1.5 border border-white/20 px-3 py-1.5 rounded-full text-gray-300 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
              >
                {walletConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                <span className="text-xs font-bold">CONNECT WALLET</span>
              </button>
            )}
            <Link
              to="/brands"
              className="bg-white text-black px-5 py-2 text-sm font-bold tracking-wide hover:bg-gray-200 transition-colors"
            >
              EXPLORE BRANDS
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-white"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-gray-300">{points} CAS</span>
            </div>
            {walletActor ? (
              <button
                onClick={disconnectWallet}
                className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-full text-green-300"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{walletActor.slice(0, 6)}</span>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                disabled={walletConnecting}
                className="flex items-center gap-1 border border-white/20 px-2 py-1 rounded-full text-gray-300 disabled:opacity-50"
              >
                {walletConnecting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wallet className="w-3.5 h-3.5" />
                )}
              </button>
            )}
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

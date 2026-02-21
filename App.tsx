import { useState, useEffect } from 'react'
import {
  Menu, X, ShoppingBag, QrCode, Truck, Star, ArrowRight, ChevronDown,
  Instagram, Twitter, Mail, ExternalLink, ShoppingCart, CreditCard,
  Wallet, Minus, Plus, Trash2, Check, Loader2, AlertCircle
} from 'lucide-react'
import './App.css'

/* Types */

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        secureData: {
          authData: { apiLoginID: string; clientKey: string }
          cardData: { cardNumber: string; month: string; year: string; cardCode: string }
        },
        callback: (response: {
          messages: {
            resultCode: string
            message: Array<{ code: string; text: string }>
          }
          opaqueData?: { dataDescriptor: string; dataValue: string }
        }) => void
      ) => void
    }
  }
}

interface Product {
  id: number
  name: string
  price: number
  image: string | null
  badge: string
  available: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

/* Data */

const brands = [
  {
    name: 'Brand 1',
    tagline: 'Premium Hemp Essentials',
    description: 'Curated hemp-derived products for the modern lifestyle.',
    color: 'from-white/10 to-white/5',
  },
  {
    name: 'Brand 2',
    tagline: 'Next-Gen Wellness',
    description: 'Science-backed formulations for peak performance.',
    color: 'from-white/10 to-white/5',
  },
  {
    name: 'Brand 3',
    tagline: 'Urban Streetwear',
    description: 'Limited drops. Bold designs. Street culture.',
    color: 'from-white/10 to-white/5',
  },
  {
    name: 'Brand 4',
    tagline: 'Tech Accessories',
    description: 'Cutting-edge gear for the connected generation.',
    color: 'from-white/10 to-white/5',
  },
  {
    name: 'Brand 5',
    tagline: 'Lifestyle & More',
    description: "Exclusive collaborations you won't find anywhere else.",
    color: 'from-white/10 to-white/5',
  },
]

const products: Product[] = [
  {
    id: 1,
    name: 'CyberAdSpace Black Tee',
    price: 35.0,
    image: '/images/tee-proof-nobg.png',
    badge: 'EXCLUSIVE',
    available: true,
  },
  {
    id: 2,
    name: 'QR Code Hoodie',
    price: 65.0,
    image: null,
    badge: 'COMING SOON',
    available: false,
  },
  {
    id: 3,
    name: 'Hemp Extract Oil',
    price: 49.99,
    image: null,
    badge: 'NEW',
    available: false,
  },
  {
    id: 4,
    name: 'CBD Gummies Pack',
    price: 39.99,
    image: null,
    badge: 'POPULAR',
    available: false,
  },
]

/* Authorize.net sandbox credentials */
const AUTHNET_API_LOGIN = 'YOUR_API_LOGIN_ID'
const AUTHNET_CLIENT_KEY = 'YOUR_PUBLIC_CLIENT_KEY'

/* App */

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* cart */
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  /* checkout */
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [paymentMessage, setPaymentMessage] = useState('')

  /* card form */
  const [cardNumber, setCardNumber] = useState('')
  const [expMonth, setExpMonth] = useState('')
  const [expYear, setExpYear] = useState('')
  const [cardCode, setCardCode] = useState('')

  /* WebAuth / XPR */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [walletSession, setWalletSession] = useState<any>(null)
  const [walletActor, setWalletActor] = useState('')
  const [walletConnecting, setWalletConnecting] = useState(false)

  /* Effects */

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load Authorize.net Accept.js (sandbox)
  useEffect(() => {
    if (document.getElementById('acceptjs-script')) return
    const script = document.createElement('script')
    script.id = 'acceptjs-script'
    script.src = 'https://jstest.authorize.net/v1/Accept.js'
    script.charset = 'utf-8'
    script.async = true
    document.head.appendChild(script)
  }, [])

  /* Cart helpers */

  const addToCart = (product: Product) => {
    if (!product.available) return
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 }
        return updated
      }
      return [...prev, { product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
    setPaymentStatus('idle')
    setPaymentMessage('')
  }

  /* Authorize.net card payment */

  const handleCardPayment = () => {
    if (!cardNumber || !expMonth || !expYear || !cardCode) {
      setPaymentStatus('error')
      setPaymentMessage('Please fill in all card fields.')
      return
    }

    if (!window.Accept) {
      setPaymentStatus('error')
      setPaymentMessage('Payment system is still loading. Please wait a moment and try again.')
      return
    }

    setPaymentStatus('processing')
    setPaymentMessage('')

    const secureData = {
      authData: {
        apiLoginID: AUTHNET_API_LOGIN,
        clientKey: AUTHNET_CLIENT_KEY,
      },
      cardData: {
        cardNumber: cardNumber.replace(/\s/g, ''),
        month: expMonth,
        year: expYear,
        cardCode,
      },
    }

    window.Accept.dispatchData(secureData, (response) => {
      if (response.messages.resultCode === 'Error') {
        setPaymentStatus('error')
        const msgs = response.messages.message.map(m => m.text).join(' ')
        setPaymentMessage(msgs)
      } else {
        setPaymentStatus('success')
        setPaymentMessage('Payment authorized! Your order is being processed.')
        setCart([])
        setCardNumber('')
        setExpMonth('')
        setExpYear('')
        setCardCode('')
      }
    })
  }

  /* WebAuth / XPR Network */

  const connectWallet = async () => {
    setWalletConnecting(true)
    setPaymentStatus('idle')
    setPaymentMessage('')
    try {
      const { default: ProtonWebSDK } = await import('@proton/web-sdk')
      const { session } = await ProtonWebSDK({
        linkOptions: {
          endpoints: ['https://proton.greymass.com'],
          restoreSession: false,
        },
        transportOptions: {
          requestAccount: 'cyberadspace',
          requestStatus: true,
        },
        selectorOptions: {
          appName: 'CyberAdSpace',
          appLogo: '/images/cybertruck-mockup-nobg.png',
        },
      })
      if (session) {
        setWalletSession(session)
        setWalletActor(String(session.auth.actor))
      }
    } catch (err: unknown) {
      console.error('Wallet connect error:', err)
      setPaymentStatus('error')
      const message = err instanceof Error ? err.message : 'Failed to connect wallet. Make sure you have WebAuth installed.'
      setPaymentMessage(message)
    }
    setWalletConnecting(false)
  }

  const handleXprPayment = async () => {
    if (!walletSession) {
      setPaymentStatus('error')
      setPaymentMessage('Please connect your wallet first.')
      return
    }
    setPaymentStatus('processing')
    setPaymentMessage('')
    try {
      await walletSession.transact({
        transaction: {
          actions: [
            {
              account: 'eosio.token',
              name: 'transfer',
              authorization: [walletSession.auth],
              data: {
                from: walletSession.auth.actor,
                to: 'cyberadspace',
                quantity: `${cartTotal.toFixed(4)} XPR`,
                memo: `CyberAdSpace order - $${cartTotal.toFixed(2)} USD`,
              },
            },
          ],
        },
      })
      setPaymentStatus('success')
      setPaymentMessage('XPR payment confirmed on-chain! Your order is being processed.')
      setCart([])
    } catch (err: unknown) {
      console.error('XPR payment error:', err)
      setPaymentStatus('error')
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      setPaymentMessage(message)
    }
  }

  /* Render */

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="#" className="flex items-center gap-2">
              <QrCode className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              <span className="text-lg sm:text-xl font-black tracking-wider">CYBER<span className="text-gray-400">AD</span>SPACE</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">ABOUT</a>
              <a href="#shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">SHOP</a>
              <a href="#brands" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">BRANDS</a>
              <a href="#truck" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">THE TRUCK</a>
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
              <a href="#contact" className="bg-white text-black px-5 py-2 text-sm font-bold tracking-wide hover:bg-gray-200 transition-colors">
                SCAN TO SHOP
              </a>
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
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-white"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-black/98 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a href="#about" onClick={() => setMenuOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">ABOUT</a>
              <a href="#shop" onClick={() => setMenuOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">SHOP</a>
              <a href="#brands" onClick={() => setMenuOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">BRANDS</a>
              <a href="#truck" onClick={() => setMenuOpen(false)} className="block text-lg font-medium text-gray-300 hover:text-white">THE TRUCK</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="block bg-white text-black px-5 py-3 text-center font-bold tracking-wide">SCAN TO SHOP</a>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gray-950 border-l border-white/10 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-black tracking-wider">YOUR CART</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                <ShoppingBag className="w-16 h-16 text-gray-700" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <button onClick={() => setCartOpen(false)} className="text-sm text-gray-400 hover:text-white underline">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 bg-white/5 border border-white/10 p-4">
                      <div className="w-20 h-20 bg-gray-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-gray-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                        <p className="text-gray-400 text-sm">${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-7 h-7 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-7 h-7 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-black">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={openCheckout}
                    className="w-full bg-white text-black py-4 font-bold tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    CHECKOUT
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCartOpen(false)} className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors">
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => { setCheckoutOpen(false); setPaymentStatus('idle') }} />
          <div className="relative w-full max-w-lg bg-gray-950 border border-white/10 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-black tracking-wider">CHECKOUT</h2>
              <button onClick={() => { setCheckoutOpen(false); setPaymentStatus('idle') }} className="p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentStatus === 'success' ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-black">ORDER CONFIRMED</h3>
                <p className="text-gray-400">{paymentMessage}</p>
                <button
                  onClick={() => { setCheckoutOpen(false); setPaymentStatus('idle') }}
                  className="bg-white text-black px-8 py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                {/* Order Summary */}
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-3">ORDER SUMMARY</h3>
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between py-2">
                      <span className="text-sm">
                        {item.product.name} <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <span className="text-sm font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-black">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => { setPaymentMethod('card'); setPaymentStatus('idle'); setPaymentMessage('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wide transition-colors ${
                      paymentMethod === 'card'
                        ? 'text-white border-b-2 border-white bg-white/5'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    PAY WITH CARD
                  </button>
                  <button
                    onClick={() => { setPaymentMethod('crypto'); setPaymentStatus('idle'); setPaymentMessage('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wide transition-colors ${
                      paymentMethod === 'crypto'
                        ? 'text-white border-b-2 border-white bg-white/5'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    PAY WITH XPR
                  </button>
                </div>

                {/* Payment Forms */}
                <div className="p-6">
                  {paymentStatus === 'error' && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 p-4 mb-6">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{paymentMessage}</p>
                    </div>
                  )}

                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div className="bg-white/5 border border-white/10 p-3">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          Sandbox Mode - Configure Authorize.net credentials for live payments
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">CARD NUMBER</label>
                        <input
                          type="text"
                          placeholder="4111 1111 1111 1111"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          maxLength={19}
                          className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">MONTH</label>
                          <input
                            type="text"
                            placeholder="MM"
                            value={expMonth}
                            onChange={e => setExpMonth(e.target.value)}
                            maxLength={2}
                            className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">YEAR</label>
                          <input
                            type="text"
                            placeholder="YYYY"
                            value={expYear}
                            onChange={e => setExpYear(e.target.value)}
                            maxLength={4}
                            className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardCode}
                            onChange={e => setCardCode(e.target.value)}
                            maxLength={4}
                            className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleCardPayment}
                        disabled={paymentStatus === 'processing'}
                        className="w-full bg-white text-black py-4 font-bold tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                      >
                        {paymentStatus === 'processing' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            PROCESSING...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            PAY ${cartTotal.toFixed(2)}
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-600 text-center mt-2">
                        Powered by Authorize.net - Your card info is encrypted and secure
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white/5 border border-white/10 p-6 text-center">
                        <Wallet className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-bold text-sm mb-1">XPR Network</h4>
                        <p className="text-xs text-gray-500">Connect your WebAuth wallet to pay with XPR tokens</p>
                      </div>

                      {walletActor ? (
                        <div className="bg-green-500/10 border border-green-500/30 p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-green-300">Wallet Connected</p>
                              <p className="text-xs text-green-400/70">{walletActor}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={connectWallet}
                          disabled={walletConnecting}
                          className="w-full border border-white/20 py-4 font-bold tracking-wide hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {walletConnecting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              CONNECTING...
                            </>
                          ) : (
                            <>
                              <Wallet className="w-4 h-4" />
                              CONNECT WEBAUTH WALLET
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={handleXprPayment}
                        disabled={!walletActor || paymentStatus === 'processing'}
                        className="w-full bg-white text-black py-4 font-bold tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentStatus === 'processing' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            CONFIRMING ON-CHAIN...
                          </>
                        ) : (
                          <>
                            PAY ${cartTotal.toFixed(2)} WITH XPR
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-600 text-center">
                        Transactions are processed on the XPR Network blockchain
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent transform skew-x-12" />
          <div className="absolute bottom-0 left-1/4 w-96 h-1 bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">Now Live</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight mb-6">
                <span className="block">CYBER</span>
                <span className="block text-gray-500">AD</span>
                <span className="block">SPACE</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                The exclusive marketplace on wheels. Scan the QR code on our Cybertruck and unlock access to curated brands you won't find anywhere else.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#shop" className="group inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-bold tracking-wide hover:bg-gray-200 transition-all">
                  SHOP NOW
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#truck" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 font-bold tracking-wide hover:bg-white/5 transition-all">
                  <Truck className="w-5 h-5" />
                  SEE THE TRUCK
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg blur-3xl" />
              <img
                src="/images/cybertruck-mockup-nobg.png"
                alt="CyberAdSpace wrapped Cybertruck with QR code"
                className="relative w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/800x500/111/333?text=CyberAdSpace+Cybertruck';
                }}
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-gray-500 tracking-widest">SCROLL</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/50 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              THE FUTURE OF <span className="text-gray-500">ADVERTISING</span>
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              CyberAdSpace is a mobile marketplace that rolls through the streets on wrapped Cybertrucks.
              Scan the QR code. Unlock exclusive drops. Shop curated brands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-5">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Scan &amp; Discover</h3>
              <p className="text-gray-400 leading-relaxed">
                Spot our Cybertruck on the streets. Scan the QR code and get instant access to exclusive products and drops.
              </p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exclusive Products</h3>
              <p className="text-gray-400 leading-relaxed">
                From hemp-derived wellness to limited streetwear, every brand on CyberAdSpace is hand-picked and exclusive.
              </p>
            </div>

            <div className="group bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Curated Brands</h3>
              <p className="text-gray-400 leading-relaxed">
                Every brand is vetted, exclusive, and ready to deliver something you can't find elsewhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Truck Section */}
      <section id="truck" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              THE <span className="text-gray-500">TRUCK</span>
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our custom-wrapped Cybertruck is a rolling billboard and your gateway to exclusive products.
              Spot it. Scan it. Shop it.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-lg blur-3xl" />
            <img
              src="/images/cybertruck-mockup-nobg.png"
              alt="CyberAdSpace Cybertruck wrap design"
              className="relative w-full h-auto hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/1200x800/111/333?text=CyberAdSpace+Cybertruck';
              }}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">360</div>
              <div className="text-sm text-gray-500 tracking-widest uppercase">Full Wrap</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">QR</div>
              <div className="text-sm text-gray-500 tracking-widest uppercase">Scan to Shop</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">24/7</div>
              <div className="text-sm text-gray-500 tracking-widest uppercase">Mobile Billboard</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              EXCLUSIVE <span className="text-gray-500">DROPS</span>
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Limited products from our curated brands. Once they're gone, they're gone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300">
                <div className="relative aspect-square bg-gray-900 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/400x400/111/333?text=${encodeURIComponent(product.name)}`;
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-600">
                      <ShoppingBag className="w-12 h-12" />
                      <span className="text-xs tracking-widest">COMING SOON</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white text-black text-xs font-bold px-3 py-1 tracking-wider">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">${product.price.toFixed(2)}</p>
                    {product.available ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white text-black text-xs font-bold px-3 py-1.5 hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        ADD
                      </button>
                    ) : (
                      <span className="text-xs text-gray-600 tracking-wider">UNAVAILABLE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.cyberadspace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-bold tracking-wide hover:bg-gray-200 transition-all"
            >
              VIEW ALL PRODUCTS
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              OUR <span className="text-gray-500">BRANDS</span>
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exclusive brands, hand-picked and curated for premium quality.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, i) => (
              <div
                key={i}
                className={`group relative bg-gradient-to-br ${brand.color} border border-white/10 p-8 hover:border-white/30 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center text-lg font-black">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold mb-1">{brand.name}</h3>
                <p className="text-sm text-gray-400 italic mb-3">{brand.tagline}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{brand.description}</p>
              </div>
            ))}

            <div className="group relative border border-dashed border-white/20 p-8 hover:border-white/40 transition-all duration-300 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-4 rounded-full">
                <span className="text-2xl font-thin text-gray-500">+</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-400">Your Brand Here</h3>
              <p className="text-gray-600 text-sm">Want to advertise on our Cybertruck? Get in touch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Merch Highlight */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6">
                WEAR THE <span className="text-gray-500">BRAND</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Rep CyberAdSpace with our exclusive merch. Each tee features the iconic logo on the front
                and a scannable QR code on the back - making you a walking billboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addToCart(products[0])}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-bold tracking-wide hover:bg-gray-200 transition-all"
                >
                  ADD TO CART - $35.00
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg blur-3xl" />
              <img
                src="/images/tee-proof-nobg.png"
                alt="CyberAdSpace black tee shirt"
                className="relative w-full max-w-lg mx-auto h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x600/111/333?text=CyberAdSpace+Tee';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spotted CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-black" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 border border-white/10 p-10 sm:p-16">
            <QrCode className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              SPOTTED THE TRUCK?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              If you've seen our wrapped Cybertruck out in the wild, scan the QR code for exclusive deals
              - or visit us directly at CyberAdSpace.com
            </p>
            <a
              href="https://www.cyberadspace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-white text-black px-10 py-4 font-bold tracking-wide hover:bg-gray-200 transition-all text-lg"
            >
              VISIT CYBERADSPACE.COM
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-6 h-6 text-white" />
                <span className="text-lg font-black tracking-wider">CYBER<span className="text-gray-500">AD</span>SPACE</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                The exclusive marketplace on wheels. Curated brands. Limited drops. Scan to shop.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm tracking-widest mb-4 text-gray-300">QUICK LINKS</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-500 hover:text-white text-sm transition-colors">About</a>
                <a href="#shop" className="block text-gray-500 hover:text-white text-sm transition-colors">Shop</a>
                <a href="#brands" className="block text-gray-500 hover:text-white text-sm transition-colors">Brands</a>
                <a href="#truck" className="block text-gray-500 hover:text-white text-sm transition-colors">The Truck</a>
                <a href="https://www.cyberadspace.com" target="_blank" rel="noopener noreferrer" className="block text-gray-500 hover:text-white text-sm transition-colors">CyberAdSpace.com</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm tracking-widest mb-4 text-gray-300">CONNECT</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs tracking-wider">
              &copy; {new Date().getFullYear()} CYBERADSPACE.COM - ALL RIGHTS RESERVED
            </p>
            <p className="text-gray-700 text-xs tracking-wider">
              EXCLUSIVE MARKETPLACE ON WHEELS
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

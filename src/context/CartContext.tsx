import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

/* ---------- types ---------- */

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

export type SizeKey = 'S' | 'M' | 'L' | 'XL' | '2XL'

export interface Product {
  id: number
  name: string
  price: number
  image: string | null
  badge: string
  available: boolean
  sizes?: Record<SizeKey, number>
}

export interface CartItem {
  product: Product
  quantity: number
  size?: SizeKey
}

/* ---------- products ---------- */

export const ALL_SIZES: SizeKey[] = ['S', 'M', 'L', 'XL', '2XL']

export const products: Product[] = [
  {
    id: 1,
    name: 'CyberAdSpace Black Tee',
    price: 35.0,
    image: '/images/tee-proof-nobg.png',
    badge: 'EXCLUSIVE',
    available: true,
    sizes: { S: 10, M: 15, L: 12, XL: 8, '2XL': 5 },
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

/* ---------- context ---------- */

interface CartContextType {
  cart: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  checkoutOpen: boolean
  setCheckoutOpen: (open: boolean) => void
  selectedSizes: Record<number, SizeKey>
  setSelectedSize: (productId: number, size: SizeKey) => void
  addToCart: (product: Product, size?: SizeKey) => void
  removeFromCart: (productId: number, size?: SizeKey) => void
  updateQuantity: (productId: number, size: SizeKey | undefined, delta: number) => void
  cartTotal: number
  cartCount: number
  openCheckout: () => void
  clearCart: () => void
  /* WebAuth wallet */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletSession: any
  walletActor: string
  walletConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Record<number, SizeKey>>({})

  /* WebAuth wallet state */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [walletSession, setWalletSession] = useState<any>(null)
  const [walletActor, setWalletActor] = useState('')
  const [walletConnecting, setWalletConnecting] = useState(false)

  const connectWallet = async () => {
    setWalletConnecting(true)
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
    }
    setWalletConnecting(false)
  }

  const disconnectWallet = () => {
    setWalletSession(null)
    setWalletActor('')
  }

  /* load Authorize.net Accept.js (sandbox) */
  useEffect(() => {
    if (document.getElementById('acceptjs-script')) return
    const script = document.createElement('script')
    script.id = 'acceptjs-script'
    script.src = 'https://jstest.authorize.net/v1/Accept.js'
    script.charset = 'utf-8'
    script.async = true
    document.head.appendChild(script)
  }, [])

  const setSelectedSize = (productId: number, size: SizeKey) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
  }

  const addToCart = (product: Product, size?: SizeKey) => {
    if (!product.available) return
    if (product.sizes && !size) return
    if (product.sizes && size) {
      const inCart = cart
        .filter((item) => item.product.id === product.id && item.size === size)
        .reduce((sum, item) => sum + item.quantity, 0)
      if (inCart >= product.sizes[size]) return
    }
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id && item.size === size)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 }
        return updated
      }
      return [...prev, { product, quantity: 1, size }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: number, size?: SizeKey) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)))
  }

  const updateQuantity = (productId: number, size: SizeKey | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = Math.max(0, item.quantity + delta)
            if (delta > 0 && item.product.sizes && item.size) {
              const max = item.product.sizes[item.size]
              return { ...item, quantity: Math.min(newQty, max) }
            }
            return { ...item, quantity: newQty }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        selectedSizes,
        setSelectedSize,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        openCheckout,
        clearCart,
        walletSession,
        walletActor,
        walletConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

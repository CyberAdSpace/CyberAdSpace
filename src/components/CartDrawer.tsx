import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal, openCheckout } =
    useCart()

  if (!cartOpen) return null

  return (
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
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.size || 'none'}`}
                  className="flex gap-4 bg-white/5 border border-white/10 p-4"
                >
                  <div className="w-20 h-20 bg-gray-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 text-sm">${item.product.price.toFixed(2)}</p>
                      {item.size && (
                        <span className="text-xs bg-white/10 border border-white/20 px-2 py-0.5 text-gray-300">
                          Size: {item.size}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, -1)}
                        className="w-7 h-7 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, 1)}
                        className="w-7 h-7 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
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
              <button
                onClick={() => setCartOpen(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  X, CreditCard, Wallet, Check, Loader2, AlertCircle,
} from 'lucide-react'
import { useCart } from '../context/CartContext'

const AUTHNET_API_LOGIN = 'YOUR_API_LOGIN_ID'
const AUTHNET_CLIENT_KEY = 'YOUR_PUBLIC_CLIENT_KEY'

export default function CheckoutModal() {
  const { cart, checkoutOpen, setCheckoutOpen, cartTotal, clearCart } = useCart()

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

  if (!checkoutOpen) return null

  const closeModal = () => {
    setCheckoutOpen(false)
    setPaymentStatus('idle')
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
        const msgs = response.messages.message.map((m) => m.text).join(' ')
        setPaymentMessage(msgs)
      } else {
        setPaymentStatus('success')
        setPaymentMessage('Payment authorized! Your order is being processed.')
        clearCart()
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
      const message =
        err instanceof Error ? err.message : 'Failed to connect wallet. Make sure you have WebAuth installed.'
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
      clearCart()
    } catch (err: unknown) {
      console.error('XPR payment error:', err)
      setPaymentStatus('error')
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      setPaymentMessage(message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
      <div className="relative w-full max-w-lg bg-gray-950 border border-white/10 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black tracking-wider">CHECKOUT</h2>
          <button onClick={closeModal} className="p-2 text-gray-400 hover:text-white">
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
              onClick={closeModal}
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
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size || 'none'}`} className="flex items-center justify-between py-2">
                  <span className="text-sm">
                    {item.product.name}
                    {item.size ? ` (${item.size})` : ''}{' '}
                    <span className="text-gray-500">x{item.quantity}</span>
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
                onClick={() => {
                  setPaymentMethod('card')
                  setPaymentStatus('idle')
                  setPaymentMessage('')
                }}
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
                onClick={() => {
                  setPaymentMethod('crypto')
                  setPaymentStatus('idle')
                  setPaymentMessage('')
                }}
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
                    <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
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
                        onChange={(e) => setExpMonth(e.target.value)}
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
                        onChange={(e) => setExpYear(e.target.value)}
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
                        onChange={(e) => setCardCode(e.target.value)}
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
                      <>PAY ${cartTotal.toFixed(2)} WITH XPR</>
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
  )
}

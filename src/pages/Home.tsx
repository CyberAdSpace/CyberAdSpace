import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowRight, QrCode, ShoppingBag, Star, Truck, Award, ChevronDown, Send,
} from 'lucide-react'
import { getFeaturedBrands } from '../config/brands'
import BrandCard from '../components/BrandCard'
import RewardsWidget from '../components/RewardsWidget'
import { trackEvent } from '../utils/analytics'

export default function Home() {
  const brands = getFeaturedBrands()
  const [joinEmail, setJoinEmail] = useState('')
  const [joinName, setJoinName] = useState('')
  const [joinBrand, setJoinBrand] = useState('')
  const [joinSubmitted, setJoinSubmitted] = useState(false)

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('join_marketplace_submit', { email: joinEmail, brand: joinBrand })
    setJoinSubmitted(true)
  }

  return (
    <div>
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
                <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                  Curated Marketplace
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight mb-6">
                <span className="block">DISCOVER</span>
                <span className="block text-gray-500">FOUNDER-LED</span>
                <span className="block">BRANDS</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                A curated marketplace of exclusive brands you won't find everywhere. From wellness
                and coffee to music and property services — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/brands"
                  onClick={() => trackEvent('explore_brands_click')}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-bold tracking-wide hover:bg-gray-200 transition-all"
                >
                  EXPLORE BRANDS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#join"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 font-bold tracking-wide hover:bg-white/5 transition-all"
                >
                  JOIN MARKETPLACE
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg blur-3xl" />
              <img
                src="/images/cybertruck-mockup-nobg.png"
                alt="CyberAdSpace wrapped Cybertruck"
                className="relative w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-gray-500 tracking-widest">SCROLL</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/50 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              HOW IT <span className="text-gray-500">WORKS</span>
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              CyberAdSpace is more than a store — it's a discovery engine powered by our fleet of
              wrapped Cybertrucks and a curated online marketplace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <QrCode className="w-6 h-6 text-white" />,
                step: '01',
                title: 'Discover',
                desc: 'Find us online or spot our wrapped Cybertruck in the wild.',
              },
              {
                icon: <Truck className="w-6 h-6 text-white" />,
                step: '02',
                title: 'Scan IRL',
                desc: 'Scan the QR code on the truck for instant access to exclusive brands.',
              },
              {
                icon: <ShoppingBag className="w-6 h-6 text-white" />,
                step: '03',
                title: 'Shop',
                desc: 'Browse curated products and services from founder-led brands.',
              },
              {
                icon: <Award className="w-6 h-6 text-white" />,
                step: '04',
                title: 'Earn Rewards',
                desc: 'Every purchase, scan, and interaction earns you Cyber Points.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-gray-700">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section id="brands" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              OUR <span className="text-gray-500">BRANDS</span>
            </h2>
            <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Founder-led brands, hand-picked and curated for quality. Each brand brings something
              unique to the marketplace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/brands"
              onClick={() => trackEvent('explore_brands_click')}
              className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-bold tracking-wide hover:bg-gray-200 transition-all"
            >
              VIEW ALL BRANDS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <RewardsWidget />

      {/* The Truck - Secondary */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs text-gray-500 tracking-widest uppercase">Our Discovery Engine</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 mt-2">
                THE <span className="text-gray-500">CYBERTRUCK</span>
              </h2>
              <div className="w-20 h-0.5 bg-white mb-6" />
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Our custom-wrapped Cybertruck rolls through the streets as a mobile discovery engine.
                Spot it, scan the QR code, and unlock instant access to our curated marketplace of
                founder-led brands.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white/5 border border-white/10 p-4">
                  <div className="text-2xl font-black text-white">360</div>
                  <div className="text-xs text-gray-500 tracking-widest">Full Wrap</div>
                </div>
                <div className="text-center bg-white/5 border border-white/10 p-4">
                  <div className="text-2xl font-black text-white">QR</div>
                  <div className="text-xs text-gray-500 tracking-widest">Scan to Shop</div>
                </div>
                <div className="text-center bg-white/5 border border-white/10 p-4">
                  <div className="text-2xl font-black text-white">24/7</div>
                  <div className="text-xs text-gray-500 tracking-widest">Moving Billboard</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-lg blur-3xl" />
              <img
                src="/images/cybertruck-mockup-nobg.png"
                alt="CyberAdSpace Cybertruck"
                className="relative w-full h-auto hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join Marketplace */}
      <section id="join" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-black" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/10 p-10 sm:p-16">
            <div className="text-center mb-10">
              <Star className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                JOIN THE <span className="text-gray-500">MARKETPLACE</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Have a founder-led brand that belongs on CyberAdSpace? Tell us about yourself and
                we'll be in touch.
              </p>
            </div>

            {joinSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-black mb-2">APPLICATION RECEIVED</h3>
                <p className="text-gray-400">
                  We'll review your brand and get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                    BRAND NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={joinBrand}
                    onChange={(e) => setJoinBrand(e.target.value)}
                    placeholder="Your brand name"
                    className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-white/50 focus:outline-none transition-colors placeholder-gray-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 font-bold tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  SUBMIT APPLICATION
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

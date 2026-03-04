import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Mail, ArrowRight, Sparkles, Home, Music, ShoppingCart, Cookie, Coffee,
} from 'lucide-react'
import { getBrandBySlug } from '../config/brands'
import { trackEvent } from '../utils/analytics'

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Home, Music, ShoppingCart, Cookie, Coffee,
}

export default function BrandDetail() {
  const { slug } = useParams<{ slug: string }>()
  const brand = slug ? getBrandBySlug(slug) : undefined

  if (!brand) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">BRAND NOT FOUND</h1>
          <p className="text-gray-400 mb-8">The brand you're looking for doesn't exist.</p>
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO BRANDS
          </Link>
        </div>
      </div>
    )
  }

  const Icon = iconComponents[brand.icon] || Sparkles

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Brands
        </Link>

        {/* Hero */}
        <div className={`bg-gradient-to-br ${brand.color} border border-white/10 p-10 sm:p-16 mb-12`}>
          {brand.image && (
            <div className="mb-6">
              <img src={brand.image} alt={brand.name} className="h-32 w-auto object-contain" />
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            {!brand.image && (
              <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <span className="text-xs text-gray-400 tracking-widest uppercase">{brand.category}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{brand.name}</h1>
            </div>
          </div>
          <p className="text-xl text-gray-300 italic mb-4">{brand.tagline}</p>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">{brand.longDescription}</p>
        </div>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {brand.ctaButtons.map((cta) => {
            const isExternal = cta.href.startsWith('http')
            if (isExternal) {
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center gap-2 py-5 font-bold tracking-wide text-lg transition-all ${
                    cta.variant === 'primary'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {cta.label}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              )
            }
            return (
              <Link
                key={cta.label}
                to={cta.href}
                className={`group flex items-center justify-center gap-2 py-5 font-bold tracking-wide text-lg transition-all ${
                  cta.variant === 'primary'
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'border border-white/20 text-white hover:bg-white/5'
                }`}
              >
                {cta.label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          })}
        </div>

        {/* Contact */}
        <div className="bg-white/5 border border-white/10 p-8">
          <h2 className="text-xl font-black tracking-wider mb-4">CONTACT {brand.name.toUpperCase()}</h2>
          <a
            href={`mailto:${brand.email}`}
            onClick={() => trackEvent('email_contact_click', { brand: brand.slug })}
            className="inline-flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-lg">{brand.email}</span>
          </a>
        </div>

        {/* Brand-specific sections */}
        {brand.slug === 'elevated-remedies' && (
          <div className="mt-12 bg-violet-500/10 border border-violet-500/20 p-8">
            <h3 className="text-xl font-black mb-3">CREATE A CUSTOM SONG</h3>
            <p className="text-gray-400 mb-6">
              Use our AI-powered music creation tool to make a custom track. Choose your vibe,
              review the lyrics, and get a full song produced in minutes.
            </p>
            <Link
              to="/create-song"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors"
            >
              CREATE A SONG
              <Music className="w-4 h-4" />
            </Link>
          </div>
        )}

        {brand.slug === 'antrias-academy' && (
          <div className="mt-12 bg-pink-500/10 border border-pink-500/20 p-8">
            <h3 className="text-xl font-black mb-3">CREATE A KIDS SONG</h3>
            <p className="text-gray-400 mb-6">
              Commission a custom children's song — educational, fun, and safe for all ages. AI-powered
              music made just for your little ones.
            </p>
            <Link
              to="/kids-song"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors"
            >
              CREATE A KIDS SONG
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        )}

        {brand.slug === 'bam-casas' && (
          <div className="mt-12 bg-blue-500/10 border border-blue-500/20 p-8">
            <h3 className="text-xl font-black mb-3">REQUEST A SERVICE</h3>
            <p className="text-gray-400 mb-6">
              Need property maintenance, repairs, or management? Submit a request and our team will
              get back to you ASAP.
            </p>
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors"
            >
              REQUEST SERVICE
              <Home className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

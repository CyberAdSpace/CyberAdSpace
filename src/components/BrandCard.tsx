import { Link } from 'react-router-dom'
import {
  ArrowRight, Sparkles, Home, Music, ShoppingCart, Cookie, Coffee,
} from 'lucide-react'
import type { Brand } from '../config/brands'
import { trackEvent } from '../utils/analytics'

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Home, Music, ShoppingCart, Cookie, Coffee,
}

interface BrandCardProps {
  brand: Brand
}

export default function BrandCard({ brand }: BrandCardProps) {
  const Icon = iconComponents[brand.icon] || Sparkles

  return (
    <Link
      to={`/brands/${brand.slug}`}
      onClick={() => trackEvent('brand_card_click', { brand: brand.slug })}
      className={`group relative bg-gradient-to-br ${brand.color} border border-white/10 p-8 hover:border-white/30 transition-all duration-300 block`}
    >
      <div className="flex items-start justify-between mb-4">
        {brand.image ? (
          <img src={brand.image} alt={brand.name} className="h-12 max-w-[160px] w-auto object-contain" />
        ) : (
          <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
      <span className="text-xs text-gray-500 tracking-widest uppercase">{brand.category}</span>
      <h3 className="text-xl font-bold mb-1 mt-1">{brand.name}</h3>
      <p className="text-sm text-gray-400 italic mb-3">{brand.tagline}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{brand.description}</p>
    </Link>
  )
}

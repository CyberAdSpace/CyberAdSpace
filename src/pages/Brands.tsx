import { useState } from 'react'
import { Search } from 'lucide-react'
import { getAllBrands, searchBrands } from '../config/brands'
import BrandCard from '../components/BrandCard'

export default function Brands() {
  const [query, setQuery] = useState('')
  const brands = query ? searchBrands(query) : getAllBrands()

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            ALL <span className="text-gray-500">BRANDS</span>
          </h1>
          <div className="w-20 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our curated collection of founder-led brands. Each one is hand-picked for quality
            and exclusivity.
          </p>
        </div>

        {/* Search / Filter */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands, categories..."
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none transition-colors placeholder-gray-600 rounded-none"
            />
          </div>
        </div>

        {/* Results */}
        {brands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No brands found matching "{query}"</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

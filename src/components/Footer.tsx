import { Link } from 'react-router-dom'
import { QrCode, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react'
import brands from '../config/brands'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <QrCode className="w-6 h-6 text-white" />
              <span className="text-lg font-black tracking-wider">
                CYBER<span className="text-gray-500">AD</span>SPACE
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              A curated marketplace of founder-led brands. Discover products, services, and
              experiences you won't find everywhere.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest mb-4 text-gray-300">OUR BRANDS</h4>
            <div className="space-y-2">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/brands/${brand.slug}`}
                  className="block text-gray-500 hover:text-white text-sm transition-colors"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest mb-4 text-gray-300">QUICK LINKS</h4>
            <div className="space-y-2">
              <Link to="/brands" className="block text-gray-500 hover:text-white text-sm transition-colors">
                Explore Brands
              </Link>
              <Link to="/create-song" className="block text-gray-500 hover:text-white text-sm transition-colors">
                Create a Song
              </Link>
              <Link to="/kids-song" className="block text-gray-500 hover:text-white text-sm transition-colors">
                Kids Song Creator
              </Link>
              <Link to="/request-service" className="block text-gray-500 hover:text-white text-sm transition-colors">
                Request Service
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest mb-4 text-gray-300">PARTNER WITH US</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Have a brand that belongs on CyberAdSpace? We're always looking for founder-led brands
              to join the marketplace.
            </p>
            <Link
              to="/#join"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-gray-300 transition-colors"
            >
              Join Marketplace
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} CYBERADSPACE.COM &mdash; ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Twitter className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="mailto:hello@cyberadspace.com"
              className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

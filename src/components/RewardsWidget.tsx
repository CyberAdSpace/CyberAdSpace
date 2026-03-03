import { Award, Star, QrCode, Music, Users, UserPlus } from 'lucide-react'
import { REWARDS_RULES } from '../services/rewards'
import { trackEvent } from '../utils/analytics'

const iconMap: Record<string, React.ReactNode> = {
  purchase: <Star className="w-5 h-5 text-amber-400" />,
  scan: <QrCode className="w-5 h-5 text-blue-400" />,
  create_song: <Music className="w-5 h-5 text-violet-400" />,
  referral: <Users className="w-5 h-5 text-green-400" />,
  signup: <UserPlus className="w-5 h-5 text-cyan-400" />,
}

export default function RewardsWidget() {
  return (
    <section className="py-20 sm:py-28 relative" onClick={() => trackEvent('rewards_view')}>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 tracking-widest uppercase">
              Rewards Program
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            EARN <span className="text-amber-400">CYBER POINTS</span>
          </h2>
          <div className="w-20 h-0.5 bg-amber-400 mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every interaction earns you Cyber Points. Shop, scan, create, and refer to build your
            balance. Redeem for discounts, early access, and exclusive drops.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {REWARDS_RULES.map((rule) => (
            <div
              key={rule.type}
              className="group bg-white/5 border border-white/10 p-6 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                  {iconMap[rule.type]}
                </div>
                <div className="text-right ml-auto">
                  <span className="text-2xl font-black text-amber-400">+{rule.points}</span>
                  <span className="text-xs text-gray-500 block">points</span>
                </div>
              </div>
              <p className="text-sm font-bold text-white">{rule.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 border border-white/10 px-8 py-4">
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">Coming Soon</p>
            <p className="text-sm text-gray-300">
              Redeem Cyber Points for discounts, exclusive products, and early access to new drops.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Send, Loader2 } from 'lucide-react'
import { trackEvent } from '../utils/analytics'

export default function RequestService() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [issueType, setIssueType] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [details, setDetails] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('request_service_submit', { issueType, urgency })
    setSubmitting(true)
    try {
      const formData = new URLSearchParams()
      formData.append('form-name', 'service-request')
      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('address', address)
      formData.append('issueType', issueType)
      formData.append('urgency', urgency)
      formData.append('details', details)

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Form submission error:', err)
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/brands/bam-casas"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BAM Casas
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-300 tracking-widest uppercase">
              BAM Casas
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            REQUEST A <span className="text-blue-400">SERVICE</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Need property maintenance, repairs, or management? Submit your request and our team will
            get back to you promptly.
          </p>
        </div>

        {submitted ? (
          <div className="bg-blue-500/10 border border-blue-500/20 p-10 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-black mb-2">SERVICE REQUEST SUBMITTED</h2>
            <p className="text-gray-400 mb-6">
              Our team will contact you at <span className="text-white">{email}</span> within 24
              hours. For urgent issues, email us directly at{' '}
              <a href="mailto:BAMCasas@CyberAdSpace.com" className="text-blue-400 hover:underline">
                BAMCasas@CyberAdSpace.com
              </a>
            </p>
            <Link
              to="/brands/bam-casas"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Back to BAM Casas
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 sm:p-10">
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-colors placeholder-gray-600"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-colors placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                  PHONE
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-colors placeholder-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                PROPERTY ADDRESS *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full property address"
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-colors placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                ISSUE TYPE *
              </label>
              <select
                required
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-colors"
              >
                <option value="">Select an issue type</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC / Air Conditioning</option>
                <option value="appliance">Appliance Repair</option>
                <option value="general">General Maintenance</option>
                <option value="property-mgmt">Property Management</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                URGENCY *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'normal', 'urgent'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-3 px-4 text-sm font-bold tracking-wide border transition-all ${
                      urgency === level
                        ? level === 'urgent'
                          ? 'bg-red-500/20 border-red-500/50 text-red-300'
                          : level === 'normal'
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                            : 'bg-green-500/20 border-green-500/50 text-green-300'
                        : 'bg-black border-white/20 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                DESCRIBE THE ISSUE
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Describe the problem, when it started, any relevant details..."
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-colors placeholder-gray-600 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-black py-4 font-bold tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SUBMITTING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  SUBMIT SERVICE REQUEST
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

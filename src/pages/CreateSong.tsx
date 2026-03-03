import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Music, Send, Loader2, Play, Pause, Download, RefreshCw } from 'lucide-react'
import { trackEvent } from '../utils/analytics'
import { API_BASE_URL } from '../config/api'

type Phase = 'form' | 'generating-lyrics' | 'review-lyrics' | 'generating-song' | 'done' | 'error'

interface SongChoice {
  url: string
  duration: number
  id: string
}

export default function CreateSong() {
  const [phase, setPhase] = useState<Phase>('form')
  const [vibe, setVibe] = useState('')
  const [occasion, setOccasion] = useState('')
  const [style, setStyle] = useState('')
  const [details, setDetails] = useState('')
  const [lyricsTitle, setLyricsTitle] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [taskId, setTaskId] = useState('')
  const [songs, setSongs] = useState<SongChoice[]>([])
  const [error, setError] = useState('')
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Poll for song status
  useEffect(() => {
    if (phase !== 'generating-song' || !taskId) return
    const interval = setInterval(async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/song/query/${taskId}`)
        const data = await resp.json()
        if (data.status === 'succeeded' && data.choices) {
          setSongs(data.choices)
          setPhase('done')
        } else if (data.status === 'failed') {
          setError('Song generation failed. Please try again.')
          setPhase('error')
        }
      } catch {
        // keep polling
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [phase, taskId])

  const handleGenerateLyrics = async (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('create_song_submit', { vibe, occasion, style })
    setPhase('generating-lyrics')
    setError('')
    try {
      const prompt = `A ${vibe} ${style || 'pop'} song${occasion ? ` for ${occasion}` : ''}. ${details || ''}`
      const resp = await fetch(`${API_BASE_URL}/api/lyrics/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!resp.ok) throw new Error('Failed to generate lyrics')
      const data = await resp.json()
      setLyricsTitle(data.title)
      setLyrics(data.lyrics)
      setPhase('review-lyrics')
    } catch {
      setError('Failed to generate lyrics. Please try again.')
      setPhase('error')
    }
  }

  const handleGenerateSong = async () => {
    setPhase('generating-song')
    setError('')
    try {
      const prompt = `${style || 'pop'}, ${vibe}${occasion ? `, ${occasion}` : ''}`
      const resp = await fetch(`${API_BASE_URL}/api/song/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lyrics }),
      })
      if (!resp.ok) throw new Error('Failed to start song generation')
      const data = await resp.json()
      setTaskId(data.id)
    } catch {
      setError('Failed to generate song. Please try again.')
      setPhase('error')
    }
  }

  const togglePlay = (idx: number, url: string) => {
    if (playingIdx === idx) {
      audioRef.current?.pause()
      setPlayingIdx(null)
    } else {
      if (audioRef.current) audioRef.current.pause()
      const audio = new Audio(url)
      audio.onended = () => setPlayingIdx(null)
      audio.play()
      audioRef.current = audio
      setPlayingIdx(idx)
    }
  }

  const formatDuration = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/brands/elevated-remedies"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Elevated Remedies
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
            <Music className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-violet-300 tracking-widest uppercase">
              Elevated Remedies
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            CREATE A <span className="text-violet-400">CUSTOM SONG</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Tell us about your song and our AI will generate lyrics and produce a full track.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Describe', 'Lyrics', 'Generate', 'Listen'].map((step, i) => {
            const stepPhases: Phase[][] = [['form'], ['generating-lyrics', 'review-lyrics'], ['generating-song'], ['done']]
            const isActive = stepPhases[i].includes(phase)
            const isPast = i < stepPhases.findIndex((sp) => sp.includes(phase))
            return (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-violet-500 text-white'
                      : isPast
                        ? 'bg-violet-500/30 text-violet-300'
                        : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs tracking-wide ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
                {i < 3 && <div className="w-6 h-px bg-white/20" />}
              </div>
            )
          })}
        </div>

        {/* Phase: Form */}
        {phase === 'form' && (
          <form onSubmit={handleGenerateLyrics} className="space-y-6 bg-white/5 border border-white/10 p-8 sm:p-10">
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                VIBE / MOOD *
              </label>
              <input
                type="text"
                required
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. Uplifting, Chill, Energetic, Romantic"
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                OCCASION
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Birthday, Wedding, Brand anthem, Just for fun"
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                MUSIC STYLE
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g. Hip-Hop, Pop, Lo-fi, R&B, Reggaeton"
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-widest mb-2">
                ADDITIONAL DETAILS
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Any themes, topics, or special requests..."
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors placeholder-gray-600 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black py-4 font-bold tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4" />
              GENERATE LYRICS
            </button>
          </form>
        )}

        {/* Phase: Generating lyrics */}
        {phase === 'generating-lyrics' && (
          <div className="bg-violet-500/10 border border-violet-500/20 p-10 text-center">
            <Loader2 className="w-12 h-12 text-violet-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-black mb-2">GENERATING LYRICS...</h2>
            <p className="text-gray-400">Our AI is crafting your lyrics. This takes a few seconds.</p>
          </div>
        )}

        {/* Phase: Review lyrics */}
        {phase === 'review-lyrics' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black">{lyricsTitle || 'YOUR LYRICS'}</h2>
                <button
                  onClick={() => setPhase('form')}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={16}
                className="w-full bg-black border border-white/20 px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:outline-none transition-colors font-mono leading-relaxed resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Edit the lyrics above if you'd like to make changes before generating the song.
              </p>
            </div>
            <button
              onClick={handleGenerateSong}
              className="w-full bg-violet-600 text-white py-4 font-bold tracking-wide hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              GENERATE SONG
            </button>
          </div>
        )}

        {/* Phase: Generating song */}
        {phase === 'generating-song' && (
          <div className="bg-violet-500/10 border border-violet-500/20 p-10 text-center">
            <Loader2 className="w-12 h-12 text-violet-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-black mb-2">PRODUCING YOUR SONG...</h2>
            <p className="text-gray-400 mb-4">
              Our AI is composing and producing your track. This usually takes 30-60 seconds.
            </p>
            <div className="w-full max-w-xs mx-auto bg-white/10 h-1 overflow-hidden">
              <div className="h-full bg-violet-500 animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* Phase: Done */}
        {phase === 'done' && songs.length > 0 && (
          <div className="space-y-6">
            <div className="bg-violet-500/10 border border-violet-500/20 p-8 text-center">
              <Music className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-2">YOUR SONG IS READY</h2>
              <p className="text-gray-400">
                We generated {songs.length} version{songs.length > 1 ? 's' : ''} of your track. Listen and download below.
              </p>
            </div>

            {songs.map((song, idx) => (
              <div key={song.id} className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                <button
                  onClick={() => togglePlay(idx, song.url)}
                  className="w-14 h-14 bg-violet-500 hover:bg-violet-400 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  {playingIdx === idx ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">
                    {lyricsTitle || 'Custom Song'} {songs.length > 1 ? `— Version ${idx + 1}` : ''}
                  </p>
                  <p className="text-sm text-gray-400">{formatDuration(song.duration)}</p>
                </div>
                <a
                  href={song.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Download className="w-4 h-4 text-white" />
                </a>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                onClick={() => { setPhase('form'); setSongs([]); setTaskId(''); setLyrics(''); setLyricsTitle('') }}
                className="flex-1 border border-white/20 text-white py-3 font-bold tracking-wide hover:bg-white/5 transition-colors"
              >
                CREATE ANOTHER
              </button>
              <Link
                to="/brands/elevated-remedies"
                className="flex-1 bg-white text-black py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors text-center"
              >
                BACK TO BRAND
              </Link>
            </div>
          </div>
        )}

        {/* Phase: Error */}
        {phase === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 p-10 text-center">
            <h2 className="text-xl font-black mb-2 text-red-300">SOMETHING WENT WRONG</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => setPhase('form')}
              className="bg-white text-black px-8 py-3 font-bold tracking-wide hover:bg-gray-200 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

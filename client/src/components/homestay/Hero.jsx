import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMagnifyingGlass, FaWandMagicSparkles } from 'react-icons/fa6'
import { HERO_SLIDES } from '../../data/destinations'

const quickTags = ['Chopta', 'Lansdowne', 'Munsiyari', 'Kausani', 'Auli', 'Pangot']

export default function Hero() {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % HERO_SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/homestays?q=${encodeURIComponent(q.trim())}` : '/homestays')
  }

  return (
    <section className="relative overflow-hidden">
      {/* crossfading background slideshow */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.img}
            src={s.img}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      <div className="relative container-px py-24 md:py-32">
        <div className="max-w-2xl animate-fade-up">
          <span className="pill bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            <FaWandMagicSparkles className="w-3.5 h-3.5 text-terra-400" /> AI-Powered · Commission-Free
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.08] mb-5">
            {HERO_SLIDES[active].title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gradient">{HERO_SLIDES[active].title.split(' ').slice(-1)}</span>
          </h1>

          <p className="text-cream-100/85 text-lg leading-relaxed mb-8 max-w-xl">
            {HERO_SLIDES[active].sub}. Get AI-personalised itineraries and book directly with local
            hosts — no middlemen, no commission.
          </p>

          {/* search card */}
          <form onSubmit={submit} className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <FaMagnifyingGlass className="w-4 h-4 text-forest-600 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try 'river cottage Rishikesh' or 'Chopta'"
                className="flex-1 bg-transparent py-3 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-accent !rounded-xl px-6">Search stays</button>
          </form>

          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-cream-100/60 text-xs">Popular:</span>
            {quickTags.map((p) => (
              <button
                key={p}
                onClick={() => navigate(`/homestays?q=${p}`)}
                className="text-xs text-white/85 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* slide indicators */}
          <div className="flex gap-2 mt-8">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.img}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-terra-400' : 'w-4 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mountain-divider absolute bottom-0 left-0 right-0" />
    </section>
  )
}

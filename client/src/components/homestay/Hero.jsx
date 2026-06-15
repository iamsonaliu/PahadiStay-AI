import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/homestays?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/homestays')
    }
  }

  return (
    <section
      className="relative bg-forest-900 text-white overflow-hidden"
      style={{ minHeight: '520px' }}
    >
      {/* background texture - subtle mountain pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 60 L30 10 L60 60Z' fill='white' opacity='0.3'/%3E%3Cpath d='M10 60 L40 20 L70 60Z' fill='white' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-block bg-terra-500/20 text-terra-500 text-sm font-medium
                           px-3 py-1 rounded-full mb-5 border border-terra-500/30">
            AI-Powered · Commission-Free
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Wake up to the{' '}
            <span className="text-terra-500">Himalayas.</span>
            <br />
            Stay with locals.
          </h1>

          <p className="text-cream-200/80 text-lg leading-relaxed mb-8 max-w-xl">
            Discover verified homestays across Uttarakhand — from Chopta to Munsiyari.
            Get personalised itineraries powered by AI and book directly with owners.
          </p>

          <form onSubmit={handleSearch} className="flex gap-0 max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try 'river cottage Rishikesh' or 'Chopta'"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 bg-white text-sm
                         focus:outline-none focus:ring-2 focus:ring-terra-500 focus:ring-inset"
            />
            <button
              type="submit"
              className="bg-terra-500 hover:bg-terra-600 px-5 py-3 rounded-r-lg
                         font-medium text-white transition-colors text-sm shrink-0"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            {['Chopta', 'Lansdowne', 'Munsiyari', 'Kausani', 'Pangot'].map((place) => (
              <button
                key={place}
                onClick={() => navigate(`/homestays?q=${place}`)}
                className="text-xs text-cream-200/70 hover:text-white border border-white/20
                           hover:border-white/50 px-3 py-1 rounded-full transition-colors"
              >
                {place}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mountain-divider absolute bottom-0 left-0 right-0 transform scale-y-150" />
    </section>
  )
}
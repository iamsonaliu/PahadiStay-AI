import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaMountain, FaRobot, FaWandMagicSparkles } from 'react-icons/fa6'
import HomestayCard from '../components/homestay/HomestayCard'
import { CATEGORIES } from '../components/homestay/CategoryStrip'
import { Skeleton } from '../components/ui'
import { homestayService, aiService } from '../services/api'
import toast from 'react-hot-toast'

const SORTS = {
  recommended: { label: 'Recommended', fn: (a, b) => b.averageRating - a.averageRating },
  priceLow:    { label: 'Price: Low to High', fn: (a, b) => a.pricePerNight - b.pricePerNight },
  priceHigh:   { label: 'Price: High to Low', fn: (a, b) => b.pricePerNight - a.pricePerNight },
  rating:      { label: 'Top Rated', fn: (a, b) => b.averageRating - a.averageRating },
}

export default function Homestays() {
  const [params, setParams] = useSearchParams()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('recommended')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [showFilters, setShowFilters] = useState(false)

  // AI Recommender States
  const [isAiMode, setIsAiMode] = useState(false)
  const [aiInterests, setAiInterests] = useState([])
  const [aiGuests, setAiGuests] = useState(2)
  const [aiResults, setAiResults] = useState([])
  const [aiLoading, setAiLoading] = useState(false)

  const q = params.get('q') || ''
  const district = params.get('district') || ''
  const category = params.get('category') || ''

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = q ? await homestayService.search(q) : await homestayService.getAll()
        setAll(res.data)
      } catch {
        toast.error('Could not load homestays. Is the backend running?')
      } finally {
        setLoading(false)
      }
    })()
  }, [q])

  const districts = useMemo(() => [...new Set(all.map((h) => h.district))].sort(), [all])

  const results = useMemo(() => {
    let r = [...all]
    if (district)  r = r.filter((h) => h.district === district)
    if (category)  r = r.filter((h) => h.category === category)
    r = r.filter((h) => h.pricePerNight <= maxPrice)
    return r.sort(SORTS[sort].fn)
  }, [all, district, category, maxPrice, sort])

  async function fetchRecommendations() {
    setAiLoading(true)
    try {
      const res = await aiService.recommend({
        district: district || undefined,
        interests: aiInterests,
        guests: Number(aiGuests),
        maxPrice: Number(maxPrice)
      })
      const recommendations = res?.data?.recommendations ?? res?.recommendations ?? []
      setAiResults(recommendations)
      setIsAiMode(true)
      toast.success('Stays ranked by AI matching relevance!')
    } catch (err) {
      toast.error(err.message || 'AI recommendation failed. Please check backend config.')
    } finally {
      setAiLoading(false)
    }
  }

  const setParam = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val); else next.delete(key)
    setParams(next)
    // Deactivate AI Mode when general parameters change to keep search intuitive
    setIsAiMode(false)
  }
  
  const clearAll = () => { 
    setParams({})
    setMaxPrice(5000) 
    setIsAiMode(false)
    setAiResults([])
    setAiInterests([])
    setAiGuests(2)
  }

  const activeFilterCount = [district, category].filter(Boolean).length + (maxPrice < 5000 ? 1 : 0)

  return (
    <>
      {/* page header */}
      <div className="bg-forest-gradient text-white">
        <div className="container-px py-12">
          <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-2">Find your stay</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {isAiMode ? 'AI Recommended Stays' : q ? `Results for "${q}"` : category ? `${category} homestays` : district ? `Homestays in ${district}` : 'All Homestays'}
          </h1>
          <p className="text-cream-100/70 mt-2">Verified Pahadi homestays across Uttarakhand</p>
        </div>
      </div>

      <div className="container-px py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-5 lg:sticky lg:top-32 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-forest-800">Filters</h3>
                {(activeFilterCount > 0 || isAiMode) && (
                  <button onClick={clearAll} className="text-xs text-terra-500 hover:underline">Clear all</button>
                )}
              </div>

              {/* district */}
              <div>
                <label className="label">District</label>
                <select value={district} onChange={(e) => setParam('district', e.target.value)} className="input">
                  <option value="">All districts</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* category */}
              <div>
                <label className="label">Experience</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(({ key, Icon }) => (
                    <button
                      key={key}
                      onClick={() => setParam('category', category === key ? '' : key)}
                      className={`pill border text-xs ${category === key ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-forest-700 border-cream-300 hover:border-forest-400'}`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* price */}
              <div>
                <label className="label">Max price · ₹{maxPrice.toLocaleString('en-IN')}</label>
                <input type="range" min={1000} max={5000} step={100} value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value))
                    setIsAiMode(false)
                  }}
                  className="w-full accent-forest-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹1,000</span><span>₹5,000</span>
                </div>
              </div>

              {/* AI Recommender Panel */}
              <div className="pt-4 border-t border-cream-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="label flex items-center gap-1.5 font-bold !text-forest-800 dark:!text-cream-100">
                    <FaRobot className="w-4 h-4 text-amber-500 animate-bounce" /> AI Recommender
                  </label>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
                    Gemini AI
                  </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-cream-100/60 leading-relaxed">
                  Personal stay suggestions that match your specific travel interests.
                </p>

                {/* interests selection */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-gray-400 block">Select Interests</span>
                  <div className="flex flex-wrap gap-1">
                    {['Trekking', 'Temples', 'Wildlife', 'Photography', 'Adventure', 'Peace & Wellness', 'Local Food', 'Snow'].map((interest) => {
                      const selected = aiInterests.includes(interest)
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => setAiInterests(prev => selected ? prev.filter(x => x !== interest) : [...prev, interest])}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${selected ? 'bg-amber-500 text-white border-amber-500 font-semibold shadow-sm' : 'bg-white dark:bg-forest-800 text-gray-600 dark:text-cream-100 border-cream-300 hover:border-amber-400'}`}
                        >
                          {interest}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* guests selection */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">Guests</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAiGuests(g => Math.max(1, g - 1))}
                      className="w-8 h-8 rounded-lg border border-cream-300 dark:border-white/10 grid place-items-center text-sm font-bold bg-white dark:bg-forest-800 text-gray-700 dark:text-cream-100 hover:bg-cream-50"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{aiGuests}</span>
                    <button
                      type="button"
                      onClick={() => setAiGuests(g => Math.min(10, g + 1))}
                      className="w-8 h-8 rounded-lg border border-cream-300 dark:border-white/10 grid place-items-center text-sm font-bold bg-white dark:bg-forest-800 text-gray-700 dark:text-cream-100 hover:bg-cream-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={aiLoading || aiInterests.length === 0}
                  onClick={fetchRecommendations}
                  className="w-full btn-primary !bg-amber-500 hover:!bg-amber-600 text-white disabled:opacity-50 text-xs py-2 shadow-sm font-bold"
                >
                  {aiLoading ? 'AI is matching…' : 'Match Stays with AI'}
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section>
            {isAiMode && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-saffron-500/15 to-transparent border border-amber-500/20 text-forest-900 dark:text-cream-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white grid place-items-center shrink-0 shadow-sm">
                    <FaRobot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">AI Recommender Mode Active</h4>
                    <p className="text-xs text-gray-500 dark:text-cream-100/60 mt-0.5">
                      Stays ranked by personalized matching score based on your selected interests.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiMode(false)}
                  className="btn-outline !py-1.5 !px-3 text-xs shrink-0 self-start sm:self-auto hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors"
                >
                  Return to normal search
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading || aiLoading ? 'Loading…' : isAiMode ? `${aiResults.length} recommendation${aiResults.length !== 1 ? 's' : ''} found` : `${results.length} stay${results.length !== 1 ? 's' : ''} found`}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilters((s) => !s)} className="lg:hidden btn-outline !py-2 !px-3 text-sm">
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto !py-2 text-sm">
                  {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            {loading || aiLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} variant="card" />)}
              </div>
            ) : isAiMode && aiResults.length === 0 ? (
              <div className="card p-12 text-center">
                <FaMountain className="w-14 h-14 mx-auto mb-4 text-forest-300" />
                <h3 className="font-semibold mb-1">No AI recommendations found</h3>
                <p className="text-sm text-gray-500 mb-4">Try widening your price range or changing interests.</p>
                <button onClick={clearAll} className="btn-primary">Clear filters</button>
              </div>
            ) : isAiMode ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {aiResults.map((r, i) => (
                  <HomestayCard 
                    key={r.homestay._id} 
                    homestay={r.homestay} 
                    index={i} 
                    aiScore={r.score}
                    aiReason={r.reason}
                  />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="card p-12 text-center">
                <FaMountain className="w-14 h-14 mx-auto mb-4 text-forest-300" />
                <h3 className="font-semibold mb-1">No homestays match your filters</h3>
                <p className="text-sm text-gray-500 mb-4">Try widening your price range or clearing filters.</p>
                <button onClick={clearAll} className="btn-primary">Clear filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((h, i) => <HomestayCard key={h._id} homestay={h} index={i} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

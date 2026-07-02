import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaMountain } from 'react-icons/fa6'
import HomestayCard from '../components/homestay/HomestayCard'
import { CATEGORIES } from '../components/homestay/CategoryStrip'
import { Skeleton } from '../components/ui'
import { homestayService } from '../services/api'
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

  const setParam = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val); else next.delete(key)
    setParams(next)
  }
  const clearAll = () => { setParams({}); setMaxPrice(5000) }

  const activeFilterCount = [district, category].filter(Boolean).length + (maxPrice < 5000 ? 1 : 0)

  return (
    <>
      {/* page header */}
      <div className="bg-forest-gradient text-white">
        <div className="container-px py-12">
          <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-2">Find your stay</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {q ? `Results for "${q}"` : category ? `${category} homestays` : district ? `Homestays in ${district}` : 'All Homestays'}
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
                {activeFilterCount > 0 && (
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
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-forest-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹1,000</span><span>₹5,000</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading…' : `${results.length} stay${results.length !== 1 ? 's' : ''} found`}
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

            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} variant="card" />)}
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

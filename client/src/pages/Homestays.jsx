import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HomestayCard from '../components/homestay/HomestayCard'
import { Skeleton } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import { homestayService } from '../services/api'

const districts = ['All', 'Rudraprayag', 'Pithoragarh', 'Tehri Garhwal', 'Pauri Garhwal', 'Bageshwar', 'Nainital', 'Chamoli', 'Dehradun']

export default function Homestays() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery       = searchParams.get('q') || ''
  const selectedDistrict  = searchParams.get('district') || 'All'

  const [homestays, setHomestays] = useState([])
  const [loading, setLoading]     = useState(true)

  const fetchHomestays = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (searchQuery) {
        res = await homestayService.search(searchQuery)
      } else {
        const params = {}
        if (selectedDistrict !== 'All') params.district = selectedDistrict
        res = await homestayService.getAll(params)
      }
      setHomestays(res.data)
    } catch {
      toast.error('Failed to load homestays. Make sure the server is running.')
      setHomestays([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedDistrict])

  useEffect(() => { fetchHomestays() }, [fetchHomestays])

  function setDistrict(d) {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    if (d === 'All') next.delete('district')
    else next.set('district', d)
    setSearchParams(next)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-1">
        <div className="bg-forest-900 text-white py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Homestays'}
            </h1>
            <p className="text-cream-200/70 text-sm">
              {loading ? 'Searching…' : `${homestays.length} propert${homestays.length === 1 ? 'y' : 'ies'} found in Uttarakhand`}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* district filter chips — only shown when not in search mode */}
          {!searchQuery && (
            <div className="flex gap-2 flex-wrap mb-8">
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedDistrict === d
                      ? 'bg-forest-900 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-forest-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="card" />)}
            </div>
          ) : homestays.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🏔</p>
              <p className="font-medium text-gray-600">No homestays found</p>
              <p className="text-sm mt-1">Try a different location or clear the filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homestays.map(stay => (
                <HomestayCard key={stay._id} homestay={stay} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
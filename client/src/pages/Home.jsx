import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/homestay/Hero'
import HomestayCard from '../components/homestay/HomestayCard'
import { Skeleton } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import { homestayService, statsService } from '../services/api'

const features = [
  {
    icon: '🗺️',
    title: 'AI Trip Planner',
    desc: 'Get a personalised day-by-day itinerary based on your interests, budget, and travel dates.',
  },
  {
    icon: '🏡',
    title: 'Direct Booking',
    desc: 'Connect directly with owners over WhatsApp or email. No commission, no middlemen.',
  },
  {
    icon: '⭐',
    title: 'Verified Reviews',
    desc: 'Only guests who actually stayed can leave a review. AI summarises what matters most.',
  },
]

export default function Home() {
  const [homestays, setHomestays] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [hRes, sRes] = await Promise.all([
          homestayService.getAll(),
          statsService.get(),
        ])
        setHomestays(hRes.data.slice(0, 4))
        setStats(sRes.data)
      } catch (err) {
        toast.error('Could not load homestays. Is the server running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-1">
        <Hero />

        {/* live stats strip */}
        {stats && (
          <div className="bg-terra-500 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Homestays Listed', value: stats.totalHomestays },
                { label: 'Guest Reviews', value: stats.totalReviews },
                { label: 'Avg Rating', value: `${stats.avgRating} ★` },
                { label: 'Districts', value: stats.districtsRepresented },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-white/80 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* featured homestays */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-terra-500 text-sm font-medium uppercase tracking-wider mb-1">
                Handpicked for you
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-forest-900">
                Popular stays this season
              </h2>
            </div>
            <Link
              to="/homestays"
              className="text-sm text-terra-500 hover:text-terra-600 font-medium transition-colors hidden sm:block"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {homestays.map(stay => (
                <HomestayCard key={stay._id} homestay={stay} />
              ))}
            </div>
          )}

          <div className="mt-6 sm:hidden text-center">
            <Link to="/homestays" className="btn-outline text-sm">View all homestays</Link>
          </div>
        </section>

        {/* how it works */}
        <section className="bg-forest-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-terra-500 text-sm font-medium uppercase tracking-wider mb-2">
                Simple by design
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">How PahadiStay works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(({ icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-cream-200/70 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/planner" className="btn-primary">Plan my Uttarakhand trip</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
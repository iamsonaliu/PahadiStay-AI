import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaCommentDots, FaHandshake, FaHouseChimney, FaMapLocationDot, FaRobot, FaStar } from 'react-icons/fa6'
import { statsService } from '../services/api'

const offers = [
  { icon: FaHouseChimney, title: 'Homestay Discovery', desc: 'Curated stays by district, experience, price, and verified guest fit.' },
  { icon: FaMapLocationDot, title: 'AI Trip Planner', desc: 'Day-by-day Uttarakhand itineraries shaped around budget, dates, and interests.' },
  { icon: FaRobot, title: 'AI Recommender', desc: 'Personal stay suggestions that match travellers to hidden mountain homes.' },
  { icon: FaHandshake, title: 'Direct Booking', desc: 'Commission-light connections between hosts and guests, without OTA friction.' },
  { icon: FaCommentDots, title: 'Travel Chatbot', desc: 'Fast answers for routes, weather, homestays, local etiquette, and trip ideas.' },
  { icon: FaStar, title: 'Review System', desc: 'Guest feedback that builds trust and helps families improve every stay.' },
  { icon: FaRobot, title: 'AI Review Analyzer', desc: 'Sentiment, themes, and suggested replies distilled from guest reviews.' },
  { icon: FaChartLine, title: 'Owner Dashboard', desc: 'Bookings, revenue, occupancy, analytics, and signals in one calm workspace.' },
]

const statItems = (stats) => [
  { label: 'Homestays listed', value: stats?.totalHomestays ?? stats?.homestays ?? 48 },
  { label: 'Guest reviews', value: stats?.totalReviews ?? stats?.reviews ?? 320 },
  {
    label: 'Average rating',
    value: (
      <span className="inline-flex items-center justify-center gap-1.5">
        {stats?.avgRating ?? stats?.averageRating ?? 4.8}
        <FaStar className="h-6 w-6 text-gold-500" />
      </span>
    ),
  },
  { label: 'Districts represented', value: stats?.districtsRepresented ?? stats?.districts ?? 13 },
]

export default function About() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let active = true
    statsService.get().then((res) => {
      if (active) setStats(res.data ?? res)
    }).catch(() => {
      if (active) setStats(null)
    })
    return () => { active = false }
  }, [])

  return (
    <div className="bg-cream-100 dark:bg-forest-900">
      <section className="relative overflow-hidden bg-forest-gradient text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#e0891e_0,transparent_25%),radial-gradient(circle_at_80%_30%,#00aeef_0,transparent_24%)]" />
        <div className="container-px section relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">About the platform</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white">About PahadiStay AI</h1>
            <p className="mt-6 text-lg text-cream-100/80 leading-relaxed">
              A local-first homestay platform for Uttarakhand, blending direct discovery with AI planning and owner analytics.
            </p>
          </div>
        </div>
        <div className="mountain-divider" />
      </section>

      <section className="container-px section">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="animate-fade-up">
            <p className="eyebrow mb-3">Our mission</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Give every hidden hill home a fair digital path.</h2>
            <p className="text-gray-600 dark:text-cream-100/75 leading-relaxed text-lg">
              Most Uttarakhand homestays are hidden behind high-commission OTAs. PahadiStay changes that by helping travellers discover verified local stays, plan meaningful trips, and connect directly with hosts who know the mountains best.
            </p>
            <p className="mt-4 text-gray-600 dark:text-cream-100/75 leading-relaxed">
              We are built for families in villages, students building practical AI, and travellers who want slower, more respectful journeys through Garhwal and Kumaon.
            </p>
          </div>
          <div className="card p-6 grid grid-cols-2 gap-4 animate-fade-up animate-delay-100">
            {statItems(stats).map((item) => (
              <div key={item.label} className="rounded-2xl bg-cream-100 dark:bg-forest-900/60 p-5 text-center">
                <div className="text-3xl font-bold text-forest-700 dark:text-terra-400">{item.value}</div>
                <div className="mt-2 text-xs text-gray-500 dark:text-cream-100/60">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px pb-16 md:pb-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-3">What we offer</p>
          <h2 className="text-3xl md:text-4xl font-bold">A complete Himalayan travel layer</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer, index) => (
            <article key={offer.title} className="card p-6 animate-fade-up" style={{ animationDelay: `${index * 45}ms` }}>
              <div className="w-12 h-12 grid place-items-center rounded-2xl bg-forest-50 dark:bg-white/10 text-forest-600 dark:text-terra-400 mb-5">
                <offer.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
              <p className="text-sm text-gray-600 dark:text-cream-100/70 leading-relaxed">{offer.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/60 dark:bg-forest-800/50 border-y border-cream-200 dark:border-white/10">
        <div className="container-px py-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div>
            <p className="eyebrow mb-2">Built with</p>
            <h2 className="text-2xl font-bold">Modern, practical web technology</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['React', 'Node', 'MongoDB', 'Gemini'].map((tech) => <span key={tech} className="pill bg-forest-50 text-forest-700 dark:bg-white/10 dark:text-cream-50">{tech}</span>)}
          </div>
        </div>
      </section>

      <section className="container-px section">
        <div className="card p-8 md:p-10 bg-gradient-to-br from-white to-cream-100 dark:from-forest-800 dark:to-forest-900 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="eyebrow mb-3">Start building trust</p>
            <h2 className="text-3xl font-bold mb-3">List your homestay or find your next mountain base.</h2>
            <p className="text-gray-600 dark:text-cream-100/70">Built for TBI-GEU SIP 2026 · by Sonali Upadhyay</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/register" className="btn-accent">List your homestay</Link>
            <Link to="/homestays" className="btn-outline">Browse stays</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

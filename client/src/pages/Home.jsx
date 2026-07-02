import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaMapLocationDot, FaHandshake, FaStar, FaQuoteLeft,
  FaArrowRightLong, FaLocationDot,
} from 'react-icons/fa6'
import Hero from '../components/homestay/Hero'
import HomestayCard from '../components/homestay/HomestayCard'
import CategoryStrip, { CATEGORIES } from '../components/homestay/CategoryStrip'
import UttarakhandMap from '../components/map/UttarakhandMap'
import Carousel from '../components/ui/Carousel'
import { Skeleton } from '../components/ui'
import { DESTINATIONS } from '../data/destinations'
import { homestayService, statsService } from '../services/api'
import toast from 'react-hot-toast'

const steps = [
  { Icon: FaMapLocationDot, title: 'AI Trip Planner', desc: 'A personalised day-by-day itinerary from your interests, budget and dates.' },
  { Icon: FaHandshake, title: 'Direct Booking', desc: 'Connect with hosts over WhatsApp or email. No commission, no middlemen.' },
  { Icon: FaStar, title: 'Verified Reviews', desc: 'Only real guests review. AI summarises what matters most for your stay.' },
]

const testimonials = [
  { name: 'Priya Sharma', place: 'Chopta', text: 'The misty mornings near Tungnath were unforgettable. Booking directly with our host felt personal and warm.', avatar: 'https://i.pravatar.cc/80?img=45' },
  { name: 'Vikram Tiwari', place: 'Munsiyari', text: 'Panchachuli views from the breakfast table — PahadiStay found us a gem no OTA had listed.', avatar: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Ananya Reddy', place: 'Kausani', text: 'The AI planner mapped our whole 5-day trip. We just showed up and soaked in the mountains.', avatar: 'https://i.pravatar.cc/80?img=32' },
]

function DestinationSlide({ d }) {
  return (
    <Link to={`/homestays?q=${encodeURIComponent(d.name)}`} className="group block relative h-80 rounded-2xl overflow-hidden shadow-soft">
      <img src={d.img} alt={`${d.name}, ${d.district}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <p className="flex items-center gap-1 text-xs text-cream-100/80 mb-1">
          <FaLocationDot className="w-3 h-3" /> {d.district}
        </p>
        <h3 className="text-xl font-bold text-white">{d.name}</h3>
        <p className="text-sm text-cream-100/80">{d.blurb}</p>
      </div>
    </Link>
  )
}

export default function Home() {
  const [homestays, setHomestays] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState('All')

  useEffect(() => {
    (async () => {
      try {
        const [h, s] = await Promise.all([homestayService.getAll(), statsService.get()])
        setHomestays(h.data)
        setStats(s.data)
      } catch {
        toast.error('Could not reach the server. Is the backend running on :5000?')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      <Hero />

      {/* live stats */}
      {stats && (
        <div className="bg-forest-700 text-white">
          <div className="container-px grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 text-center">
            {[
              { label: 'Homestays Listed', value: stats.totalHomestays },
              { label: 'Guest Reviews', value: stats.totalReviews },
              { label: 'Avg Rating', value: stats.avgRating, star: true },
              { label: 'Districts', value: stats.districtsRepresented },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold flex items-center justify-center gap-1">
                  {s.value}{s.star && <FaStar className="w-5 h-5 text-gold-400" />}
                </div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* categories */}
      <section className="container-px section !py-14">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Travel your way</p>
          <h2 className="text-2xl md:text-3xl font-bold">Explore by experience</h2>
        </div>
        <CategoryStrip />
      </section>

      {/* popular destinations carousel */}
      <section className="container-px pb-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-1">Iconic Uttarakhand</p>
            <h2 className="text-2xl md:text-3xl font-bold">Popular destinations</h2>
          </div>
          <Link to="/homestays" className="hidden sm:inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-700 font-medium">
            Explore all <FaArrowRightLong className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Carousel slideClass="w-72 sm:w-80">
          {DESTINATIONS.map((d) => <DestinationSlide key={d.name} d={d} />)}
        </Carousel>
      </section>

      {/* featured */}
      <section className="container-px section !pt-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-1">Handpicked for you</p>
            <h2 className="text-2xl md:text-3xl font-bold">Popular stays this season</h2>
          </div>
          <Link to="/homestays" className="hidden sm:inline-flex items-center gap-1 text-sm text-forest-600 hover:text-forest-700 font-medium">
            View all <FaArrowRightLong className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} variant="card" />)
            : homestays.slice(0, 4).map((h, i) => <HomestayCard key={h._id} homestay={h} index={i} />)}
        </div>
      </section>

      {/* interactive district map */}
      <section className="bg-gradient-to-b from-cream-100 to-cream-200/60 dark:from-forest-900 dark:to-forest-800">
        <div className="container-px section">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="eyebrow mb-2">Discover the state</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Hover a district to explore Uttarakhand</h2>
              <p className="text-gray-600 dark:text-cream-100/70 mb-6 leading-relaxed">
                From the Char Dham circuit to the bugyals of Chopta — pick a region or an
                experience and we'll surface verified homestays nearby. Click any district to start.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveCat('All')}
                  className={`pill border transition-colors ${activeCat === 'All' ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-forest-700 border-cream-300'}`}
                >
                  All
                </button>
                {CATEGORIES.slice(0, 6).map(({ key, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveCat(key)}
                    className={`pill border transition-colors ${activeCat === key ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-forest-700 border-cream-300'}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {key}
                  </button>
                ))}
              </div>

              <Link to="/homestays" className="btn-primary">Browse all homestays</Link>
            </div>

            <div className="card p-4 md:p-6">
              <UttarakhandMap homestays={homestays} activeCategory={activeCat} />
              <p className="text-center text-xs text-gray-400 mt-2">
                {homestays.length} stays plotted · hover to highlight · click to explore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-forest-gradient text-white section">
        <div className="container-px">
          <div className="text-center mb-12">
            <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-2">Simple by design</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">How PahadiStay works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ Icon, title, desc }) => (
              <div key={title} className="text-center px-4">
                <div className="w-16 h-16 mx-auto mb-4 grid place-items-center rounded-2xl bg-white/10 text-terra-400">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-cream-100/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/planner" className="btn-accent">Plan my Uttarakhand trip</Link>
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="container-px section">
        <div className="text-center mb-12">
          <p className="eyebrow mb-2">Loved by travellers</p>
          <h2 className="text-2xl md:text-3xl font-bold">Stories from the mountains</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="card p-6">
              <FaQuoteLeft className="w-6 h-6 text-terra-300 mb-3" />
              <div className="flex gap-0.5 text-gold-500 mb-3">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}
              </div>
              <blockquote className="text-gray-600 dark:text-cream-100/80 leading-relaxed mb-5">{t.text}</blockquote>
              <figcaption className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-forest-800 dark:text-cream-50 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">Stayed in {t.place}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA — list your homestay */}
      <section className="container-px pb-20">
        <div className="relative overflow-hidden rounded-3xl text-white px-8 py-14 md:px-16">
          <img src="/images/cta-mountains.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-900/80" />
          <div className="relative max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Own a homestay in the hills?</h2>
            <p className="text-cream-100/85 mb-6 leading-relaxed">
              List it commission-free and reach travellers directly. Get AI review insights and a
              simple owner dashboard — keep 100% of what you earn.
            </p>
            <Link to="/register" className="btn-accent">List your homestay free</Link>
          </div>
        </div>
      </section>
    </>
  )
}

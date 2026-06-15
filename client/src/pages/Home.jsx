import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/homestay/Hero'
import HomestayCard from '../components/homestay/HomestayCard'
import { Link } from 'react-router-dom'

// placeholder data until the API is wired up
const sampleHomestays = [
  {
    _id: '1',
    name: 'Bugyali Homestay',
    village: 'Chopta',
    district: 'Rudraprayag',
    pricePerNight: 1800,
    averageRating: 4.8,
    totalReviews: 24,
    propertyType: 'Forest Cottage',
    imageUrls: ['https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=600&q=80'],
  },
  {
    _id: '2',
    name: 'Pahadi Nest',
    village: 'Munsiyari',
    district: 'Pithoragarh',
    pricePerNight: 2200,
    averageRating: 4.9,
    totalReviews: 18,
    propertyType: 'Mountain Bungalow',
    imageUrls: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'],
  },
  {
    _id: '3',
    name: 'Deodar House',
    village: 'Kanatal',
    district: 'Tehri Garhwal',
    pricePerNight: 1500,
    averageRating: 4.6,
    totalReviews: 31,
    propertyType: 'Village Cottage',
    imageUrls: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80'],
  },
  {
    _id: '4',
    name: 'Riverside Camp',
    village: 'Lansdowne',
    district: 'Pauri Garhwal',
    pricePerNight: 1200,
    averageRating: 4.4,
    totalReviews: 12,
    propertyType: 'Riverside Camp',
    imageUrls: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'],
  },
]

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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Hero />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sampleHomestays.map((stay) => (
              <HomestayCard key={stay._id} homestay={stay} />
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link to="/homestays" className="btn-outline text-sm">
              View all homestays
            </Link>
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
              <Link to="/planner" className="btn-primary">
                Plan my Uttarakhand trip
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
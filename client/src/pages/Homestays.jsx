import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HomestayCard from '../components/homestay/HomestayCard'
import { useSearchParams } from 'react-router-dom'

const allHomestays = [
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
  {
    _id: '5',
    name: 'Kumaoni Retreat',
    village: 'Kausani',
    district: 'Bageshwar',
    pricePerNight: 2500,
    averageRating: 4.7,
    totalReviews: 9,
    propertyType: 'Village Cottage',
    imageUrls: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80'],
  },
  {
    _id: '6',
    name: 'Pangot Bird Lodge',
    village: 'Pangot',
    district: 'Nainital',
    pricePerNight: 3200,
    averageRating: 4.9,
    totalReviews: 41,
    propertyType: 'Forest Bungalow',
    imageUrls: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80'],
  },
]

const districts = ['All', 'Rudraprayag', 'Pithoragarh', 'Tehri Garhwal', 'Pauri Garhwal', 'Bageshwar', 'Nainital']

export default function Homestays() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const selectedDistrict = searchParams.get('district') || 'All'

  const filtered = allHomestays.filter((stay) => {
    const matchesSearch = searchQuery
      ? stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.district.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesDistrict = selectedDistrict === 'All' || stay.district === selectedDistrict
    return matchesSearch && matchesDistrict
  })

  function setDistrict(d) {
    const next = new URLSearchParams(searchParams)
    if (d === 'All') next.delete('district')
    else next.set('district', d)
    setSearchParams(next)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="bg-forest-900 text-white py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Homestays'}
            </h1>
            <p className="text-cream-200/70 text-sm">{filtered.length} properties found in Uttarakhand</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* district filter chips */}
          <div className="flex gap-2 flex-wrap mb-8">
            {districts.map((d) => (
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

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🏔</p>
              <p className="font-medium text-gray-600">No homestays found</p>
              <p className="text-sm mt-1">Try a different location or clear the filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((stay) => (
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
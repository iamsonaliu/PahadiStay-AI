import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const statsCards = [
  { label: 'Bookings this month', value: '—', icon: '📅' },
  { label: 'Average rating', value: '—', icon: '⭐' },
  { label: 'Occupancy rate', value: '—', icon: '🏡' },
  { label: 'Inquiry conversion', value: '—', icon: '📊' },
]

export default function DashboardOverview() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-forest-900">Owner Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track your bookings, reviews, and AI-generated insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statsCards.map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-2xl font-bold text-forest-900 mb-0.5">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Recent bookings</h2>
              <div className="text-sm text-gray-400 py-8 text-center">
                Booking data will appear here once the API is connected.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Review summary</h2>
              <div className="text-sm text-gray-400 py-8 text-center">
                AI-analysed review insights will appear here in Phase 3.
              </div>
            </div>
          </div>

          <div className="mt-5 bg-terra-500/5 border border-terra-500/20 rounded-xl p-5">
            <p className="text-sm text-terra-600 font-medium">🚧 This dashboard is under active development.</p>
            <p className="text-xs text-gray-500 mt-1">
              Charts, booking tables, and AI performance summaries will be added in Phases 2 and 3.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
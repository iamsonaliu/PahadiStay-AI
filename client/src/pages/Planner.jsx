import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const interests = [
  'Trekking & Adventure',
  'Nature & Wildlife',
  'Photography',
  'Yoga & Wellness',
  'Religious Sites',
  'Local Cuisine',
  'Offbeat Exploration',
  'Workcation',
]

export default function Planner() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="bg-forest-900 text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-3xl mb-4 block">🗺️</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">AI Trip Planner</h1>
            <p className="text-cream-200/75 text-lg">
              Tell us what you're looking for and we'll build a personalised Uttarakhand itinerary with homestay suggestions.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-forest-900 mb-6">Plan your trip</h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number of days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    defaultValue="5"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Budget (₹ total)
                  </label>
                  <input
                    type="number"
                    min="500"
                    defaultValue="15000"
                    step="500"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Group type
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option>Solo traveller</option>
                  <option>Couple</option>
                  <option>Family with children</option>
                  <option>Group of friends</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What interests you?
                </label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item) => (
                    <label key={item} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" className="accent-terra-500 w-3.5 h-3.5" />
                      <span className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100
                                       border border-gray-200 px-3 py-1 rounded-full transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled
                className="w-full bg-terra-500 text-white py-3 rounded-lg font-medium
                           opacity-60 cursor-not-allowed text-sm mt-2"
              >
                Generate itinerary — coming in Phase 2
              </button>

              <p className="text-xs text-gray-400 text-center">
                AI itinerary generation will be available once the Gemini API integration is complete.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
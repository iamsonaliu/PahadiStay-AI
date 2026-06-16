import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-14 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">🏡</span>
            <h1 className="text-2xl font-bold text-forest-900 mt-3 mb-1">Create an account</h1>
            <p className="text-gray-500 text-sm">Join as a traveller or homestay owner</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-2 gap-2 mb-5">
              {['Traveller', 'Homestay Owner'].map((role) => (
                <button
                  key={role}
                  className="py-2 text-sm border border-gray-200 rounded-lg text-gray-600
                             hover:border-forest-800 hover:text-forest-900 transition-colors first:bg-forest-900 first:text-white first:border-forest-900"
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <button
                type="button"
                className="w-full bg-terra-500 hover:bg-terra-600 text-white py-2.5 rounded-lg
                           font-medium text-sm transition-colors"
              >
                Create account
              </button>
            </div>

            <div className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-terra-500 hover:text-terra-600 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
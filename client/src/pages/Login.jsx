import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-14 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">⛰</span>
            <h1 className="text-2xl font-bold text-forest-900 mt-3 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your PahadiStay account</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-terra-500 hover:text-terra-600">Forgot?</a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent"
                />
              </div>

              <button
                type="button"
                className="w-full bg-forest-900 hover:bg-forest-800 text-white py-2.5 rounded-lg
                           font-medium text-sm transition-colors"
              >
                Sign in
              </button>
            </div>

            <div className="mt-5 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-terra-500 hover:text-terra-600 font-medium">
                Register
              </Link>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Auth integration coming in Phase 1 development.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
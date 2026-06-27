import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button, Input } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.email.trim())    e.email    = 'Email is required'
    if (!form.password.trim()) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleLogin() {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Auth integration coming in Phase 2!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
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
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
                required
              />
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-terra-500 hover:text-terra-600">Forgot?</a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                />
              </div>

              <Button variant="secondary" className="w-full" loading={loading} onClick={handleLogin}>
                Sign in
              </Button>
            </div>

            <div className="mt-5 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-terra-500 hover:text-terra-600 font-medium">Register</Link>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Auth integration coming in Phase 2 development.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
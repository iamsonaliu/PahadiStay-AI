import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const from = location.state?.from?.pathname || '/dashboard'

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back to PahadiStay AI')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Could not sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-cream-100 dark:bg-forest-900">
      <div className="container-px section">
        <div className="card overflow-hidden grid lg:grid-cols-2 min-h-[680px] animate-fade-up">
          <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-forest-gradient p-10 text-white">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80"
              alt="Snowy Himalayan peaks at sunrise"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-hero-overlay" />
            <div className="relative z-10">
              <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">Owner portal</p>
              <h1 className="text-4xl xl:text-5xl font-bold text-white max-w-md">Welcome back to the hills.</h1>
              <p className="mt-5 max-w-md text-cream-100/80 leading-relaxed">
                Manage direct bookings, read guest signals, and grow your Uttarakhand homestay with AI-powered clarity.
              </p>
            </div>
            <div className="relative z-10 glass rounded-2xl p-5 bg-white/15 border-white/20 text-sm text-cream-50/90">
              “Hidden homestays deserve their own digital front door — without high OTA commissions.”
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:p-14 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="lg:hidden rounded-3xl bg-forest-gradient p-6 text-white mb-8 overflow-hidden relative">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-terra-400/20" />
                <p className="text-terra-300 text-xs font-semibold uppercase tracking-[0.18em] mb-2">PahadiStay AI</p>
                <h1 className="text-3xl font-bold text-white">Welcome back</h1>
              </div>

              <p className="eyebrow mb-3">Sign in</p>
              <h2 className="text-3xl font-bold mb-3">Owner dashboard login</h2>
              <p className="text-gray-600 dark:text-cream-100/70 mb-8">Enter your details to continue managing your stays.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label" htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" autoComplete="email" required className="input" value={form.email} onChange={update} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="label" htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required className="input" value={form.password} onChange={update} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Signing in…' : 'Sign in to dashboard'}
                </button>
              </form>

              <div className="mt-8 rounded-2xl bg-cream-100 dark:bg-forest-900/60 border border-cream-200 dark:border-white/10 p-4 text-sm text-gray-600 dark:text-cream-100/70">
                Demo: register any email to try the owner dashboard.
              </div>
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-cream-100/70">
                New here? <Link to="/register" className="font-semibold text-forest-600 dark:text-terra-400 hover:underline">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const initialForm = { name: '', email: '', password: '', role: 'owner', phone: '' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!['traveller', 'owner'].includes(form.role)) next.role = 'Choose a valid role.'
    return next
  }, [form])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const showError = (field) => touched[field] && errors[field]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setTouched({ name: true, email: true, password: true, role: true })
    if (Object.keys(errors).length) return

    setSubmitting(true)
    try {
      await register({ ...form, phone: form.phone.trim() || undefined })
      toast.success('Your PahadiStay account is ready')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-cream-100 dark:bg-forest-900">
      <div className="container-px section">
        <div className="card overflow-hidden grid lg:grid-cols-2 animate-fade-up">
          <aside className="relative min-h-72 lg:min-h-[760px] bg-forest-gradient p-8 sm:p-10 text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80"
              alt="Layered Himalayan mountain landscape"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-hero-overlay" />
            <div className="relative z-10 max-w-lg">
              <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">Join the network</p>
              <h1 className="text-4xl xl:text-5xl font-bold text-white">Bring your mountain home online.</h1>
              <p className="mt-5 text-cream-100/80 leading-relaxed">
                List, manage, and understand guest demand with tools designed for Uttarakhand hosts and travellers.
              </p>
            </div>
            <div className="relative z-10 mt-10 grid sm:grid-cols-3 gap-3 text-sm">
              {['Direct booking', 'AI insights', 'Local-first'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur">{item}</div>
              ))}
            </div>
          </aside>

          <div className="p-6 sm:p-10 lg:p-14 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <p className="eyebrow mb-3">Create account</p>
              <h2 className="text-3xl font-bold mb-3">Start with PahadiStay AI</h2>
              <p className="text-gray-600 dark:text-cream-100/70 mb-8">Use any email for the demo and explore the owner dashboard.</p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="label" htmlFor="name">Full name</label>
                  <input id="name" name="name" className="input" value={form.name} onChange={update} onBlur={() => setTouched((t) => ({ ...t, name: true }))} placeholder="Sonali Upadhyay" required />
                  {showError('name') && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" autoComplete="email" className="input" value={form.email} onChange={update} onBlur={() => setTouched((t) => ({ ...t, email: true }))} placeholder="you@example.com" required />
                  {showError('email') && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" autoComplete="new-password" className="input" value={form.password} onChange={update} onBlur={() => setTouched((t) => ({ ...t, password: true }))} placeholder="Minimum 6 characters" required />
                  {showError('password') && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="role">I am a</label>
                    <select id="role" name="role" className="input" value={form.role} onChange={update} onBlur={() => setTouched((t) => ({ ...t, role: true }))}>
                      <option value="traveller">Traveller</option>
                      <option value="owner">Homestay owner</option>
                    </select>
                    {showError('role') && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">Phone <span className="text-gray-400">(optional)</span></label>
                    <input id="phone" name="phone" type="tel" className="input" value={form.phone} onChange={update} placeholder="+91…" />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="btn-accent w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-cream-100/70">
                Already listed? <Link to="/login" className="font-semibold text-forest-600 dark:text-terra-400 hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

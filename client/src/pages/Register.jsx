import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button, Input } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'

export default function Register() {
  const [role, setRole]       = useState('Traveller')
  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim())  e.lastName  = 'Last name is required'
    if (!form.email.trim())     e.email     = 'Email is required'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleRegister() {
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
            <span className="text-3xl">🏡</span>
            <h1 className="text-2xl font-bold text-forest-900 mt-3 mb-1">Create an account</h1>
            <p className="text-gray-500 text-sm">Join as a traveller or homestay owner</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-2 gap-2 mb-5">
              {['Traveller', 'Homestay Owner'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 text-sm border rounded-lg transition-colors ${
                    role === r
                      ? 'bg-forest-900 text-white border-forest-900'
                      : 'border-gray-200 text-gray-600 hover:border-forest-800 hover:text-forest-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} error={errors.firstName} required />
                <Input label="Last name"  value={form.lastName}  onChange={e => setForm(f => ({ ...f, lastName:  e.target.value }))} error={errors.lastName}  />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} required />
              <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password} required />

              <Button variant="primary" className="w-full" loading={loading} onClick={handleRegister}>
                Create account
              </Button>
            </div>

            <div className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-terra-500 hover:text-terra-600 font-medium">Sign in</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
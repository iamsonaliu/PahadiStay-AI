import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/bookings', label: 'Bookings' },
  { to: '/dashboard/reviews', label: 'Reviews' },
  { to: '/dashboard/analytics', label: 'Analytics' },
]

export default function DashboardLayout() {
  const { user } = useAuth()
  const name = user?.name || user?.fullName || 'host'

  return (
    <section className="bg-cream-100 dark:bg-forest-900 min-h-[calc(100vh-120px)]">
      <div className="container-px py-8 md:py-12">
        <div className="mb-8 animate-fade-up">
          <p className="eyebrow mb-2">Namaste, {name}</p>
          <h1 className="text-3xl md:text-4xl font-bold">Owner Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-cream-100/70">Bookings, guest sentiment, and performance insights for your homestays.</p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
          <aside className="card p-3 lg:sticky lg:top-28 overflow-x-auto animate-fade-up animate-delay-100">
            <nav className="flex lg:flex-col gap-2 min-w-max lg:min-w-0" aria-label="Dashboard sections">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-forest-600 text-white shadow-soft' : 'text-forest-700 hover:bg-forest-50 dark:text-cream-100 dark:hover:bg-white/10'}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 animate-fade-up animate-delay-200">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  )
}

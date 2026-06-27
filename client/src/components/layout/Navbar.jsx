import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

const navLinks = [
  { to: '/homestays', label: 'Homestays' },
  { to: '/planner',   label: 'Trip Planner' },
  { to: '/about',     label: 'About' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-forest-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-terra-500 text-2xl">⛰</span>
            <span className="font-bold text-lg tracking-tight">
              Pahadi<span className="text-terra-500">Stay</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'text-terra-500' : 'text-cream-200 hover:text-white transition-colors'
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <DarkModeToggle />
            <Link to="/login" className="text-sm text-cream-200 hover:text-white transition-colors px-2">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
              Get started
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle />
            <button
              className="p-2 rounded-md text-cream-200 hover:text-white hover:bg-forest-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-forest-800 py-3 pb-4 space-y-1">
            {[...navLinks, { to: '/login', label: 'Sign in' }].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-800 text-terra-500'
                      : 'text-cream-200 hover:bg-forest-800 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
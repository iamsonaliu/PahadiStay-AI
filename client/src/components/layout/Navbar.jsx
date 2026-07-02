import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../brand/Logo'
import DarkModeToggle from './DarkModeToggle'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/homestays', label: 'Homestays' },
  { to: '/planner',   label: 'Trip Planner' },
  { to: '/about',     label: 'About' },
  { to: '/contact',   label: 'Contact' },
]

function FontControls() {
  const { incFont, decFont, resetFont } = useSettings()
  const Btn = ({ onClick, children, label }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 grid place-items-center rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
    >
      {children}
    </button>
  )
  return (
    <div className="flex items-center gap-1">
      <Btn onClick={incFont} label="Increase font size">A<sup>+</sup></Btn>
      <Btn onClick={resetFont} label="Reset font size">A</Btn>
      <Btn onClick={decFont} label="Decrease font size">A<sup>−</sup></Btn>
    </div>
  )
}

function LangToggle() {
  const { lang, toggleLang } = useSettings()
  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 text-xs font-medium text-white/90"
      aria-label="Toggle language"
    >
      <span className={lang === 'en' ? 'text-white' : 'text-white/50'}>English</span>
      <span className="relative w-9 h-5 rounded-full bg-white/25">
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${lang === 'en' ? 'left-0.5' : 'left-4'}`} />
      </span>
      <span className={lang === 'hi' ? 'text-white' : 'text-white/50'}>हिंदी</span>
    </button>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthed, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-[1000]">
      {/* top utility bar */}
      <div className="bg-forest-900 text-white">
        <div className="container-px flex items-center justify-between h-10 text-xs">
          <span className="hidden sm:block text-white/80 font-script text-base">
            Welcome to the lap of the Himalayas
          </span>
          <div className="flex items-center gap-4 ml-auto">
            <LangToggle />
            <span className="w-px h-4 bg-white/20" />
            <FontControls />
          </div>
        </div>
      </div>

      {/* main nav */}
      <nav className="bg-forest-600 text-white shadow-card">
        <div className="container-px">
          <div className="flex items-center justify-between h-16">
            <Logo light />

            <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative py-1 transition-colors ${
                      isActive ? 'text-white' : 'text-white/75 hover:text-white'
                    } after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-terra-400 after:transition-all ${
                      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <DarkModeToggle />
              {isAuthed ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="text-sm text-white/90 hover:text-white">
                    Hi, {user?.name?.split(' ')[0] || 'Host'}
                  </Link>
                  <button onClick={logout} className="bg-white text-forest-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-cream-100 transition-colors">
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white px-2">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-white text-forest-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-cream-100 transition-colors shadow-soft">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <DarkModeToggle />
              <button
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden border-t border-white/15 py-3 pb-4 space-y-1 animate-fade-in">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-2">
                {isAuthed ? (
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="flex-1 bg-white text-forest-700 text-sm font-medium px-4 py-2.5 rounded-xl">Sign out</button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center border border-white/40 text-white text-sm px-4 py-2.5 rounded-xl">Sign In</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-white text-forest-700 text-sm font-semibold px-4 py-2.5 rounded-xl">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

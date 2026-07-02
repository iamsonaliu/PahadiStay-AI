import { Link } from 'react-router-dom'

/**
 * PahadiStay brand mark — emerald mountain + saffron sun + sky river,
 * with a "Simply Heaven"-style script tagline.
 */
export default function Logo({ to = '/', light = false, withTagline = true }) {
  const wordColor = light ? 'text-white' : 'text-forest-900'
  const tagColor = light ? 'text-cream-200/90' : 'text-forest-600'

  return (
    <Link to={to} className="flex items-center gap-2.5 shrink-0 group">
      <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl shadow-soft overflow-hidden">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0d8a5f" />
              <stop offset="1" stopColor="#00684a" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="14" fill="url(#lg)" />
          <path d="M12 44 L26 20 L36 36 L42 26 L52 44 Z" fill="#ffffff" />
          <circle cx="44" cy="18" r="5" fill="#f4b400" />
          <path d="M12 48 H52" stroke="#00aeef" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block font-bold text-lg tracking-tight ${wordColor}`}>
          Pahadi<span className="text-terra-500">Stay</span>
        </span>
        {withTagline && (
          <span className={`block font-script text-base leading-none -mt-0.5 ${tagColor}`}>
            Simply Himalayan
          </span>
        )}
      </span>
    </Link>
  )
}

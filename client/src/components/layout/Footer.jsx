import { Link } from 'react-router-dom'

const footerLinks = {
  Explore: [
    { label: 'Browse Homestays', to: '/homestays' },
    { label: 'AI Trip Planner', to: '/planner' },
    { label: 'About Us', to: '/about' },
  ],
  'For Owners': [
    { label: 'List Your Property', to: '/register' },
    { label: 'Owner Dashboard', to: '/dashboard' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Use', to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-terra-500 text-xl">⛰</span>
              <span className="font-bold text-white">
                Pahadi<span className="text-terra-500">Stay</span>
              </span>
            </Link>
            <p className="text-sm text-cream-200/70 leading-relaxed">
              Connecting travellers with authentic Uttarakhand homestays.
              Commission-free. AI-powered.
            </p>
            <div className="flex gap-3 mt-4">
              {['Instagram', 'Twitter', 'YouTube'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  aria-label={platform}
                  className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center
                             text-xs text-cream-200/60 hover:bg-terra-500 hover:text-white transition-colors"
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-cream-200/70 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-forest-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-cream-200/50">
            © {new Date().getFullYear()} PahadiStay AI. Built for TBI-GEU SIP 2026.
          </p>
          <p className="text-xs text-cream-200/40">Made with ☕ for the mountains 🏔</p>
        </div>
      </div>
    </footer>
  )
}
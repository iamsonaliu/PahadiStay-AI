import { Link } from 'react-router-dom'
import { FaXTwitter, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa6'
import Logo from '../brand/Logo'

const socials = [
  { Icon: FaXTwitter, label: 'Twitter' },
  { Icon: FaInstagram, label: 'Instagram' },
  { Icon: FaFacebookF, label: 'Facebook' },
  { Icon: FaYoutube, label: 'YouTube' },
]

const cols = [
  {
    title: 'Explore',
    links: [
      { to: '/homestays', label: 'All Homestays' },
      { to: '/homestays?category=Adventure', label: 'Adventure Stays' },
      { to: '/homestays?category=Char Dham', label: 'Char Dham' },
      { to: '/planner', label: 'AI Trip Planner' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/register', label: 'List your Homestay' },
      { to: '/dashboard', label: 'Owner Dashboard' },
    ],
  },
  {
    title: 'Regions',
    links: [
      { to: '/homestays?district=Rudraprayag', label: 'Rudraprayag' },
      { to: '/homestays?district=Nainital', label: 'Nainital' },
      { to: '/homestays?district=Pithoragarh', label: 'Pithoragarh' },
      { to: '/homestays?district=Chamoli', label: 'Chamoli' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-100/80 mt-auto">
      <div className="mountain-divider rotate-180" style={{ background: 'transparent' }} />
      <div className="container-px py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo light />
            <p className="text-sm text-cream-100/60 leading-relaxed mt-4 max-w-xs">
              Discover and book verified homestays across Uttarakhand. Commission-free,
              AI-powered, and built with love for the mountains.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                   className="w-9 h-9 grid place-items-center rounded-lg bg-white/10 hover:bg-terra-500 transition-colors text-white">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-cream-100/60 hover:text-terra-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-100/50">
          <p>© {new Date().getFullYear()} PahadiStay AI · Built for TBI-GEU SIP 2026</p>
          <p className="font-script text-lg text-cream-100/80">Simply Himalayan</p>
        </div>
      </div>
    </footer>
  )
}

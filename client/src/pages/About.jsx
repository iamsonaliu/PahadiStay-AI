import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'

const stats = [
  { value: '8', label: 'Feature modules planned' },
  { value: '3', label: 'AI-powered features' },
  { value: '0%', label: 'Commission charged' },
]

const techStack = [
  { layer: 'Frontend', tech: 'React 19 · Vite · Tailwind CSS · React Router' },
  { layer: 'Backend', tech: 'Node.js · Express.js · MongoDB Atlas · Mongoose' },
  { layer: 'AI', tech: 'Google Gemini API (gemini-1.5-pro / flash)' },
  { layer: 'Auth', tech: 'JWT · bcryptjs' },
  { layer: 'Deploy', tech: 'Vercel (client) · Render (server)' },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="bg-forest-900 text-white py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About PahadiStay AI</h1>
            <p className="text-cream-200/75 text-lg leading-relaxed">
              A full-stack internship project built for TBI-GEU SIP 2026 — connecting travellers
              with Uttarakhand homestay owners through AI-powered discovery and direct booking.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-3 gap-6 mb-14">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-3xl font-bold text-terra-500 mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-14">
            <div>
              <h2 className="text-xl font-semibold text-forest-900 mb-3">The problem</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hundreds of family-run homestays across Uttarakhand lose 18–25% of their earnings
                to OTA commissions. They have no access to their own guest data, no way to act on
                feedback, and no affordable digital presence.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                On the traveller side, discovering authentic stays beyond the usual hotel chains
                means hours of scattered research across blogs, YouTube, and WhatsApp groups.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-forest-900 mb-3">What we're building</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                PahadiStay AI is a commission-free platform where travellers get AI-generated
                itineraries and personalised homestay recommendations, while owners get a digital
                presence, direct bookings, and AI-analysed review insights.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                Everything is powered by Google Gemini API — from the trip planner to the chatbot
                to the monthly owner performance summaries.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-forest-900 mb-4">Tech stack</h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {techStack.map(({ layer, tech }) => (
                <div key={layer} className="flex gap-4 px-5 py-3 bg-white items-center">
                  <span className="text-xs font-semibold text-terra-500 uppercase tracking-wider w-20 shrink-0">
                    {layer}
                  </span>
                  <span className="text-sm text-gray-600">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/homestays" className="btn-primary mr-3">
              Browse homestays
            </Link>
            <Link to="/planner" className="btn-outline">
              Try the planner
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
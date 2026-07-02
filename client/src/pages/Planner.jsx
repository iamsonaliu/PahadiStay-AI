import { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { FaWandMagicSparkles, FaMapLocationDot, FaArrowRightLong, FaRegCopy, FaMountainSun } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import { aiService } from '../services/api'

const DISTRICTS = ['Rudraprayag', 'Chamoli', 'Pithoragarh', 'Nainital', 'Tehri Garhwal', 'Pauri Garhwal', 'Bageshwar', 'Dehradun', 'Uttarkashi']
const INTERESTS = ['Trekking', 'Temples', 'Wildlife', 'Photography', 'Adventure', 'Peace & Wellness', 'Local Food', 'Bird Watching', 'Snow']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Planner() {
  const [form, setForm] = useState({ destination: 'Chopta, Rudraprayag', days: 3, budget: 'mid', travelMonth: 'October' })
  const [interests, setInterests] = useState(['Trekking', 'Photography'])
  const [itinerary, setItinerary] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleInterest = (i) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  async function generate(e) {
    e.preventDefault()
    setLoading(true); setItinerary('')
    try {
      const res = await aiService.planTrip({ ...form, days: Number(form.days), interests })
      setItinerary(res.data.itinerary || res.data.reply || 'No itinerary returned.')
    } catch (err) {
      toast.error(err.message || 'Could not generate itinerary')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="bg-forest-gradient text-white">
        <div className="container-px py-14">
          <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-2">Powered by AI</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Uttarakhand Trip Planner</h1>
          <p className="text-cream-100/75 max-w-xl">
            Tell us where, how long, and what you love — get a personalised, day-by-day Himalayan itinerary in seconds.
          </p>
        </div>
      </div>

      <div className="container-px py-10 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* form */}
        <form onSubmit={generate} className="card p-6 space-y-5 lg:sticky lg:top-32 h-fit">
          <div>
            <label className="label">Destination</label>
            <input list="districts" value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="e.g. Chopta, Rudraprayag" className="input" />
            <datalist id="districts">{DISTRICTS.map((d) => <option key={d} value={d} />)}</datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Days</label>
              <input type="number" min={1} max={14} value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Travel month</label>
              <select value={form.travelMonth} onChange={(e) => setForm({ ...form, travelMonth: e.target.value })} className="input">
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Budget</label>
            <div className="grid grid-cols-3 gap-2">
              {[['budget', '₹ Budget'], ['mid', '₹₹ Comfort'], ['premium', '₹₹₹ Premium']].map(([v, l]) => (
                <button type="button" key={v} onClick={() => setForm({ ...form, budget: v })}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${form.budget === v ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-forest-700 border-cream-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button type="button" key={i} onClick={() => toggleInterest(i)}
                  className={`pill border text-xs ${interests.includes(i) ? 'bg-terra-500 text-white border-terra-500' : 'bg-white text-forest-700 border-cream-300'}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            <FaWandMagicSparkles className="w-4 h-4" />
            {loading ? 'Crafting your journey…' : 'Generate itinerary'}
          </button>
        </form>

        {/* output */}
        <div>
          {loading ? (
            <div className="card p-8 space-y-3">
              <div className="h-6 w-1/3 bg-cream-200 rounded animate-pulse" />
              {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-cream-200 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />)}
            </div>
          ) : itinerary ? (
            <div className="card p-6 md:p-8 animate-fade-up">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-cream-200">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaMapLocationDot className="w-5 h-5 text-forest-600" /> Your {form.days}-day itinerary
                </h2>
                <button onClick={() => navigator.clipboard.writeText(itinerary).then(() => toast.success('Copied!'))}
                  className="btn-ghost text-sm"><FaRegCopy className="w-4 h-4" /> Copy</button>
              </div>
              <div className="ai-prose text-gray-700 dark:text-cream-100/85">
                <ReactMarkdown>{itinerary}</ReactMarkdown>
              </div>
              <div className="mt-6 pt-5 border-t border-cream-200 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-500">Ready to book a stay along this route?</p>
                <Link to="/homestays" className="btn-accent text-sm">Find homestays <FaArrowRightLong className="w-3.5 h-3.5" /></Link>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FaMountainSun className="w-16 h-16 mx-auto mb-4 text-forest-300 animate-float" />
              <h3 className="font-semibold text-lg mb-2">Your Himalayan adventure awaits</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Fill in your preferences and our AI will craft a day-by-day plan with stays, treks,
                temples and local tips tailored just for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

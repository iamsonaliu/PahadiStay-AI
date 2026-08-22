import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FaStar, FaWandMagicSparkles } from 'react-icons/fa6'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { bookingService, dashboardService } from '../../services/api'

const currency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
const percent = (value) => `${Number(value || 0).toFixed(0)}%`
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'

function StatCard({ label, value, hint }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500 dark:text-cream-100/60">{label}</p>
      <div className="mt-2 text-3xl font-bold text-forest-800 dark:text-cream-50">{value}</div>
      {hint && <p className="mt-2 text-xs text-terra-600 dark:text-terra-400">{hint}</p>}
    </div>
  )
}

export default function Overview() {
  const [overview, setOverview] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const res = await dashboardService.overview()
        console.log('dashboard overview response', res)
        const data = res?.data ?? res ?? {}
        let recent = data?.recentBookings ?? []
        if (!recent.length) {
          const bookingRes = await bookingService.getAll()
          recent = bookingRes?.data ?? []
        }
        if (active) {
          setOverview(data)
          setBookings(Array.isArray(recent) ? recent : [])
        }
      } catch (error) {
        try {
          const bookingRes = await bookingService.getAll()
          if (active) setBookings(bookingRes?.data ?? [])
        } catch {
          if (active) toast.error(error.message || 'Could not load dashboard')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const totals = overview?.totals ?? overview ?? {}
  const trend = useMemo(() => {
    const raw = overview?.monthlyTrend ?? overview?.trend ?? []
    return Array.isArray(raw) ? raw.map((item, index) => ({
      month: item?.month ?? item?.label ?? `M${index + 1}`,
      bookings: Number(item?.bookings ?? item?.count ?? item?.totalBookings ?? 0),
    })) : []
  }, [overview])

  const stats = [
    { label: 'Total Bookings', value: totals?.totalBookings ?? totals?.bookings ?? bookings.length ?? 0, hint: 'All-time reservations' },
    { label: 'Revenue', value: currency(totals?.revenue ?? totals?.totalRevenue ?? bookings.reduce((sum, b) => sum + Number(b?.totalAmount || 0), 0)), hint: 'Gross booking value' },
    { label: 'Occupancy', value: percent(totals?.occupancy ?? totals?.occupancyRate), hint: 'Estimated occupancy' },
    {
      label: 'Avg Rating',
      value: (
        <span className="inline-flex items-center gap-1.5">
          {Number(totals?.avgRating ?? totals?.averageRating ?? 0).toFixed(1)}
          <FaStar className="h-6 w-6 text-gold-500" />
        </span>
      ),
      hint: 'Guest satisfaction',
    },
  ]

  if (loading) return <div className="card p-8 text-center text-gray-500 dark:text-cream-100/70">Loading your dashboard…</div>

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* AI Monthly Summary Card */}
      {overview?.summary?.summary && (
        <section className="card p-6 bg-gradient-to-r from-forest-900 to-forest-800 text-white relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 grid place-items-center text-terra-400 shrink-0">
              <FaWandMagicSparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-white">AI Monthly Insights</h3>
                <span className="text-[10px] uppercase font-semibold bg-white/10 text-cream-100/90 px-2 py-0.5 rounded-full tracking-wider border border-white/5">
                  {overview?.summary?.provider === 'gemini' ? 'Gemini AI' : 'Deterministic fallback'}
                </span>
              </div>
              <p className="text-sm text-cream-100/95 leading-relaxed font-light">
                {overview.summary.summary}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid xl:grid-cols-[1fr_0.9fr] gap-6">
        <section className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="eyebrow mb-1">Latest activity</p>
              <h2 className="text-2xl font-bold">Recent bookings</h2>
            </div>
          </div>
          {bookings.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-400">
                  <tr><th className="py-3 pr-4">Guest</th><th className="py-3 pr-4">Stay</th><th className="py-3 pr-4">Dates</th><th className="py-3 text-right">Total</th></tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-white/10">
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking?._id ?? `${booking?.guestEmail}-${booking?.createdAt}`}>
                      <td className="py-4 pr-4 font-medium text-forest-800 dark:text-cream-50">{booking?.guestName ?? 'Guest'}</td>
                      <td className="py-4 pr-4 text-gray-600 dark:text-cream-100/70">{booking?.homestayName ?? 'Homestay'}</td>
                      <td className="py-4 pr-4 text-gray-500">{formatDate(booking?.checkIn)} → {formatDate(booking?.checkOut)}</td>
                      <td className="py-4 text-right font-semibold">{currency(booking?.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="rounded-2xl bg-cream-100 dark:bg-forest-900/60 p-6 text-gray-500 dark:text-cream-100/70">No recent bookings yet. Your first guest will appear here.</p>}
        </section>

        <section className="card p-6">
          <p className="eyebrow mb-1">Monthly trend</p>
          <h2 className="text-2xl font-bold mb-5">Bookings over time</h2>
          {trend.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#efece1" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#00684a" strokeWidth={3} dot={{ fill: '#e0891e', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-72 grid place-items-center rounded-2xl bg-cream-100 dark:bg-forest-900/60 text-gray-500 dark:text-cream-100/70 text-center px-6">Monthly trend will appear after bookings are recorded.</div>}
        </section>
      </div>
    </div>
  )
}

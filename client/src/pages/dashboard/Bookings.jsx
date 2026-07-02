import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FaMountainSun } from 'react-icons/fa6'
import { bookingService } from '../../services/api'

const currency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const filters = ['all', 'pending', 'confirmed', 'cancelled']
const badgeClass = (status = '') => ({
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200',
  confirmed: 'bg-forest-50 text-forest-700 dark:bg-forest-400/15 dark:text-forest-100',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200',
}[status.toLowerCase()] || 'bg-cream-200 text-gray-600 dark:bg-white/10 dark:text-cream-100')

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const res = await bookingService.getAll()
        if (active) setBookings(Array.isArray(res?.data) ? res.data : [])
      } catch (error) {
        toast.error(error.message || 'Could not load bookings')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const visible = useMemo(() => filter === 'all' ? bookings : bookings.filter((booking) => (booking?.status || '').toLowerCase() === filter), [bookings, filter])

  return (
    <div className="space-y-6">
      <header className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="eyebrow mb-1">Reservations</p>
          <h2 className="text-2xl font-bold">Bookings</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-cream-100/60">{visible.length} of {bookings.length} bookings shown</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`pill capitalize border transition-colors ${filter === item ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-forest-700 border-cream-300 hover:border-forest-400 dark:bg-white/10 dark:text-cream-50 dark:border-white/10'}`}>
              {item}
            </button>
          ))}
        </div>
      </header>

      <section className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-cream-100/70">Loading bookings…</div>
        ) : visible.length ? (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 dark:bg-forest-900/60 text-left text-gray-500 dark:text-cream-100/60">
                  <tr>
                    <th className="px-6 py-4">Guest</th><th className="px-6 py-4">Homestay</th><th className="px-6 py-4">Stay dates</th><th className="px-6 py-4">Nights</th><th className="px-6 py-4">Guests</th><th className="px-6 py-4 text-right">Total</th><th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-white/10">
                  {visible.map((booking) => (
                    <tr key={booking?._id ?? `${booking?.guestEmail}-${booking?.createdAt}`} className="hover:bg-cream-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4"><div className="font-semibold text-forest-800 dark:text-cream-50">{booking?.guestName ?? 'Guest'}</div><div className="text-xs text-gray-400">{booking?.guestEmail ?? '—'}</div></td>
                      <td className="px-6 py-4 text-gray-600 dark:text-cream-100/75">{booking?.homestayName ?? 'Homestay'}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(booking?.checkIn)} → {formatDate(booking?.checkOut)}</td>
                      <td className="px-6 py-4">{booking?.nights ?? '—'}</td>
                      <td className="px-6 py-4">{booking?.guests ?? '—'}</td>
                      <td className="px-6 py-4 text-right font-semibold">{currency(booking?.totalAmount)}</td>
                      <td className="px-6 py-4"><span className={`pill capitalize ${badgeClass(booking?.status)}`}>{booking?.status ?? 'pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden divide-y divide-cream-200 dark:divide-white/10">
              {visible.map((booking) => (
                <article key={booking?._id ?? `${booking?.guestEmail}-${booking?.createdAt}`} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-forest-800 dark:text-cream-50">{booking?.guestName ?? 'Guest'}</h3><p className="text-sm text-gray-500">{booking?.homestayName ?? 'Homestay'}</p></div><span className={`pill capitalize ${badgeClass(booking?.status)}`}>{booking?.status ?? 'pending'}</span></div>
                  <p className="text-sm text-gray-500">{formatDate(booking?.checkIn)} → {formatDate(booking?.checkOut)} · {booking?.nights ?? 0} nights · {booking?.guests ?? 0} guests</p>
                  <p className="font-semibold">{currency(booking?.totalAmount)}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-forest-50 text-forest-600 dark:bg-white/10 dark:text-terra-400">
              <FaMountainSun className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-gray-500 dark:text-cream-100/70">New reservations will appear here once guests book your stay.</p>
          </div>
        )}
      </section>
    </div>
  )
}

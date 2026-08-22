import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { homestayService, bookingService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import WeatherCard from '../components/homestay/WeatherCard'
import MiniMap from '../components/map/MiniMap'
import { coordsFor } from '../utils/coords'
import {
  FaWifi, FaShower, FaFire, FaUtensils, FaSquareParking, FaPersonHiking,
  FaLeaf, FaAppleWhole, FaFish, FaTree, FaBinoculars, FaBook, FaDove,
  FaPersonSkiing, FaMountain, FaCheck, FaLocationDot, FaWhatsapp, FaEnvelope, FaStar,
  FaPenToSquare, FaTrash,
} from 'react-icons/fa6'

const AMENITY_ICONS = {
  'Wi-Fi': FaWifi, 'Hot Water': FaShower, Bonfire: FaFire, 'Home-cooked Meals': FaUtensils, Parking: FaSquareParking,
  'Trekking Guide': FaPersonHiking, Garden: FaLeaf, 'Orchard Access': FaAppleWhole, Fishing: FaFish, 'Nature Walks': FaTree,
  Telescope: FaBinoculars, Library: FaBook, 'Bird-watching Guides': FaDove, Binoculars: FaBinoculars,
  'Ski Rental Help': FaPersonSkiing, 'Cable Car Access': FaMountain, 'Jungle Walks': FaTree,
}

function Stars({ rating, size = 'w-4 h-4' }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} className={`${size} ${i <= Math.round(rating) ? 'text-gold-500' : 'text-gray-300'}`} />
      ))}
    </span>
  )
}

// Week 5 — DB CRUD demo: lets a signed-in owner/admin edit or delete this homestay
// directly from the frontend (Update + Delete against the real Mongo-backed API).
function OwnerTools({ homestay, onUpdated }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    pricePerNight: homestay.pricePerNight,
    description: homestay.description || '',
    available: homestay.available,
  })

  const canManage = user && (user.role === 'owner' || user.role === 'admin')
  if (!canManage) return null

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await homestayService.update(homestay._id, {
        pricePerNight: Number(form.pricePerNight),
        description: form.description,
        available: form.available,
      })
      toast.success('Homestay updated')
      setEditing(false)
      onUpdated()
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${homestay.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await homestayService.delete(homestay._id)
      toast.success('Homestay deleted')
      navigate('/homestays')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
      setDeleting(false)
    }
  }

  return (
    <div className="card p-4 mb-6 border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          Owner tools — signed in as {user.name} ({user.role})
        </span>
        {!editing && (
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5">
              <FaPenToSquare className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={remove} disabled={deleting}
              className="!py-1.5 !px-3 text-xs rounded-lg bg-red-600 text-white flex items-center gap-1.5 disabled:opacity-60">
              <FaTrash className="w-3.5 h-3.5" /> {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {editing && (
        <form onSubmit={save} className="space-y-3 mt-2">
          <div>
            <label className="label text-xs">Price per night (₹)</label>
            <input type="number" min="0" required value={form.pricePerNight}
              onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
              className="input !py-2 text-sm" />
          </div>
          <div>
            <label className="label text-xs">Description</label>
            <textarea rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-cream-100/80">
            <input type="checkbox" checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Available for booking
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary !py-2 !px-4 text-sm disabled:opacity-60">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-outline !py-2 !px-4 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function BookingCard({ homestay }) {
  const [form, setForm] = useState({ guestName: '', guestEmail: '', checkIn: '', checkOut: '', guests: 2 })
  const [submitting, setSubmitting] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)) : 0
  const total = nights * homestay.pricePerNight

  async function submit(e) {
    e.preventDefault()
    if (nights <= 0) return toast.error('Please pick valid check-in / check-out dates')
    setSubmitting(true)
    try {
      await bookingService.create({ homestayId: homestay._id, ...form, guests: Number(form.guests) })
      toast.success('Enquiry sent! The host will reach out shortly.')
      setForm({ guestName: '', guestEmail: '', checkIn: '', checkOut: '', guests: 2 })
    } catch (err) {
      toast.error(err.message || 'Could not send enquiry')
    } finally {
      setSubmitting(false)
    }
  }

  const waText = encodeURIComponent(`Hi ${homestay.ownerName}, I'd like to enquire about ${homestay.name} on PahadiStay.`)
  const waNumber = (homestay.ownerContact || '').replace(/[^0-9]/g, '')

  return (
    <div className="card p-6 lg:sticky lg:top-32">
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold text-forest-700 dark:text-cream-50">₹{homestay.pricePerNight?.toLocaleString('en-IN')}</span>
        <span className="text-gray-400 text-sm">/ night</span>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label text-xs">Check-in</label>
            <input type="date" required value={form.checkIn} onChange={set('checkIn')} className="input !py-2 text-sm" />
          </div>
          <div>
            <label className="label text-xs">Check-out</label>
            <input type="date" required value={form.checkOut} onChange={set('checkOut')} className="input !py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="label text-xs">Guests</label>
          <select value={form.guests} onChange={set('guests')} className="input !py-2 text-sm">
            {Array.from({ length: homestay.maxGuests || 6 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <input required placeholder="Your name" value={form.guestName} onChange={set('guestName')} className="input !py-2 text-sm" />
        <input required type="email" placeholder="Your email" value={form.guestEmail} onChange={set('guestEmail')} className="input !py-2 text-sm" />

        {nights > 0 && (
          <div className="flex justify-between text-sm border-t border-cream-200 pt-3">
            <span className="text-gray-500">₹{homestay.pricePerNight?.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span className="font-semibold text-forest-700">₹{total.toLocaleString('en-IN')}</span>
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Sending…' : 'Send booking enquiry'}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400 my-3">— or contact the host directly —</div>
      <div className="grid grid-cols-2 gap-3">
        {waNumber && (
          <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-medium hover:brightness-105">
            <FaWhatsapp className="w-4 h-4" /> WhatsApp
          </a>
        )}
        <a href={`mailto:?subject=Enquiry: ${homestay.name}`}
          className="flex items-center justify-center gap-2 btn-outline !py-2.5 text-sm">
          <FaEnvelope className="w-4 h-4" /> Email
        </a>
      </div>
      <p className="text-center text-[11px] text-gray-400 mt-3">Commission-free · you pay the host directly</p>
    </div>
  )
}

function ReviewSection({ homestay, reviews, onAdded }) {
  const [form, setForm] = useState({ guestName: '', rating: 5, comment: '' })
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!form.comment.trim() || !form.guestName.trim()) return toast.error('Please fill all fields')
    setSubmitting(true)
    try {
      await homestayService.addReview(homestay._id, { ...form, rating: Number(form.rating) })
      toast.success('Thanks for your review!')
      setForm({ guestName: '', rating: 5, comment: '' }); setOpen(false); onAdded()
    } catch (err) {
      toast.error(err.message)
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Guest reviews
          <span className="text-sm font-normal text-gray-400">({reviews.length})</span>
        </h2>
        <button onClick={() => setOpen((o) => !o)} className="btn-outline !py-2 !px-4 text-sm">
          {open ? 'Cancel' : 'Write a review'}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="card p-5 mb-5 space-y-3 animate-fade-up">
          <input placeholder="Your name" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="input" />
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })}
                  className={n <= form.rating ? 'text-gold-500' : 'text-gray-300'}>
                  <FaStar className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
          <textarea placeholder="Share your experience…" rows={3} value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })} className="input resize-none" />
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? 'Posting…' : 'Post review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet — be the first to stay and share your story.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 grid place-items-center rounded-full bg-forest-100 text-forest-700 font-semibold text-sm">
                    {r.guestName?.[0]?.toUpperCase()}
                  </span>
                  <div>
                    <div className="font-medium text-forest-800 dark:text-cream-50 text-sm">{r.guestName}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="text-sm text-gray-600 dark:text-cream-100/80 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HomestayDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [homestay, setHomestay] = useState(null)
  const [reviews, setReviews] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await homestayService.getById(id)
      setHomestay(res.data)
      setReviews(res.data.reviews || [])
    } catch {
      toast.error('Homestay not found'); navigate('/homestays')
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [id]) // eslint-disable-line

  if (loading) return <div className="container-px py-20 text-center text-forest-600 animate-pulse">Loading homestay…</div>
  if (!homestay) return null

  const [lat, lng] = coordsFor(homestay)
  const images = homestay.imageUrls?.length ? homestay.imageUrls : ['/images/hero-himalaya.jpg']

  return (
    <div className="container-px py-8">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-forest-600">Home</Link> ·{' '}
        <Link to="/homestays" className="hover:text-forest-600">Homestays</Link> ·{' '}
        <span className="text-forest-700">{homestay.name}</span>
      </nav>

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{homestay.name}</h1>
          <p className="text-gray-500 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1"><Stars rating={homestay.averageRating} /> <span className="font-medium text-forest-700">{homestay.averageRating || '—'}</span></span>
            · {homestay.totalReviews} reviews · <span className="inline-flex items-center gap-1"><FaLocationDot className="w-3.5 h-3.5 text-terra-500" /> {homestay.village}, {homestay.district}</span>
          </p>
        </div>
        <span className="pill bg-forest-100 text-forest-700">{homestay.propertyType}</span>
      </div>

      <OwnerTools homestay={homestay} onUpdated={load} />

      {/* gallery */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-3 mb-8">
        <div className="rounded-2xl overflow-hidden h-[300px] md:h-[440px]">
          <img src={images[activeImg]} alt={homestay.name} className="w-full h-full object-cover" />
        </div>
        {images.length > 1 && (
          <div className="flex lg:flex-col gap-3 overflow-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`rounded-xl overflow-hidden w-24 h-20 shrink-0 border-2 ${i === activeImg ? 'border-forest-600' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* left */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">About this homestay</h2>
            <p className="text-gray-600 dark:text-cream-100/80 leading-relaxed">{homestay.description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <span className="w-8 h-8 grid place-items-center rounded-full bg-forest-100 text-forest-700 font-semibold">{homestay.ownerName?.[0]}</span>
              Hosted by <span className="font-medium text-forest-700">{homestay.ownerName}</span>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {homestay.amenities?.map((a) => {
                const Ico = AMENITY_ICONS[a] || FaCheck
                return (
                  <div key={a} className="flex items-center gap-2 text-sm text-gray-600 dark:text-cream-100/80">
                    <Ico className="w-4 h-4 text-forest-600 shrink-0" /> {a}
                  </div>
                )
              })}
            </div>
          </section>

          <section className="grid sm:grid-cols-2 gap-5">
            <WeatherCard lat={lat} lng={lng} />
            <MiniMap lat={lat} lng={lng} name={homestay.name} />
          </section>

          <section className="border-t border-cream-200 dark:border-white/10 pt-8">
            <ReviewSection homestay={homestay} reviews={reviews} onAdded={load} />
          </section>
        </div>

        {/* right — booking */}
        <aside>
          <BookingCard homestay={homestay} />
        </aside>
      </div>
    </div>
  )
}

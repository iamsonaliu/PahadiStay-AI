import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button, Input, Modal, Skeleton } from '../components/ui'
import toast, { Toaster } from 'react-hot-toast'
import { homestayService, bookingService } from '../services/api'

function StarRow({ rating, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-transform hover:scale-110"
        >
          <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function HomestayDetail() {
  const { id } = useParams()
  const [homestay, setHomestay]         = useState(null)
  const [loading, setLoading]           = useState(true)
  const [bookingOpen, setBookingOpen]   = useState(false)
  const [reviewOpen, setReviewOpen]     = useState(false)
  const [submitting, setSubmitting]     = useState(false)

  // booking form
  const [form, setForm] = useState({ guestName: '', guestEmail: '', checkIn: '', checkOut: '', guests: 1 })
  const [formErrors, setFormErrors] = useState({})

  // review form
  const [review, setReview] = useState({ guestName: '', rating: 0, comment: '' })

  useEffect(() => {
    async function load() {
      try {
        const res = await homestayService.getById(id)
        setHomestay(res.data)
      } catch {
        toast.error('Homestay not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function validateBooking() {
    const errs = {}
    if (!form.guestName.trim())  errs.guestName  = 'Name is required'
    if (!form.guestEmail.trim()) errs.guestEmail = 'Email is required'
    if (!form.checkIn)           errs.checkIn    = 'Check-in date required'
    if (!form.checkOut)          errs.checkOut   = 'Check-out date required'
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn)
      errs.checkOut = 'Check-out must be after check-in'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleBooking() {
    if (!validateBooking()) return
    setSubmitting(true)
    try {
      const res = await bookingService.create({ ...form, homestayId: id, guests: Number(form.guests) })
      toast.success(`Booking confirmed! Total: ₹${res.data.totalAmount.toLocaleString('en-IN')}`)
      setBookingOpen(false)
      setForm({ guestName: '', guestEmail: '', checkIn: '', checkOut: '', guests: 1 })
    } catch (err) {
      toast.error(err.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReview() {
    if (!review.guestName.trim() || !review.comment.trim() || review.rating === 0) {
      toast.error('Please fill in all fields and select a rating')
      return
    }
    setSubmitting(true)
    try {
      await homestayService.addReview(id, review)
      toast.success('Review submitted!')
      const updated = await homestayService.getById(id)
      setHomestay(updated.data)
      setReviewOpen(false)
      setReview({ guestName: '', rating: 0, comment: '' })
    } catch (err) {
      toast.error(err.message || 'Could not submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
          <Skeleton className="h-72 w-full rounded-2xl mb-6" />
          <Skeleton lines={5} />
        </main>
        <Footer />
      </div>
    )
  }

  if (!homestay) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🏔</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Homestay not found</h2>
            <Link to="/homestays" className="text-terra-500 hover:underline text-sm">Back to all homestays</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const coverImg = homestay.imageUrls?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-1">
        {/* Hero image */}
        <div className="h-72 md:h-96 overflow-hidden relative">
          <img src={coverImg} alt={homestay.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="bg-white/90 text-forest-800 text-xs font-medium px-3 py-1 rounded-full">
              {homestay.propertyType}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Left column — details */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-forest-900">{homestay.name}</h1>
                {homestay.averageRating > 0 && (
                  <div className="shrink-0 flex items-center gap-1 bg-forest-900 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                    <span>★</span>
                    <span>{homestay.averageRating}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-500 text-sm mb-5">
                {homestay.village}, {homestay.district} · {homestay.totalReviews} review{homestay.totalReviews !== 1 ? 's' : ''}
              </p>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">{homestay.description}</p>

              {/* amenities */}
              {homestay.amenities?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-forest-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {homestay.amenities.map(a => (
                      <span key={a} className="text-sm bg-forest-50 border border-forest-200 text-forest-800 px-3 py-1 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* owner contact */}
              <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 mb-8">
                <h3 className="font-semibold text-forest-900 mb-1">Meet your host</h3>
                <p className="text-sm text-gray-600">{homestay.ownerName}</p>
                <a href={`tel:${homestay.ownerContact}`} className="text-sm text-terra-500 hover:underline mt-1 block">
                  {homestay.ownerContact}
                </a>
              </div>

              {/* reviews section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-forest-900 text-lg">
                    Guest reviews {homestay.reviews?.length > 0 && `(${homestay.reviews.length})`}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>
                    Write a review
                  </Button>
                </div>

                {!homestay.reviews?.length ? (
                  <p className="text-sm text-gray-400 italic">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  <div className="space-y-4">
                    {homestay.reviews.map(r => (
                      <div key={r._id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-800">{r.guestName}</span>
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            {'★'.repeat(r.rating)}
                            <span className="text-gray-400 text-xs ml-1">{r.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column — booking card */}
            <div>
              <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-forest-900">
                    ₹{homestay.pricePerNight?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-400 text-sm"> / night</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Up to {homestay.maxGuests} guests · Commission-free</p>
                <Button variant="primary" className="w-full" onClick={() => setBookingOpen(true)}>
                  Request to book
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title="Request to book" size="md">
        <div className="space-y-4">
          <Input label="Your name" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} error={formErrors.guestName} required />
          <Input label="Email" type="email" value={form.guestEmail} onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))} error={formErrors.guestEmail} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Check-in" type="date" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} error={formErrors.checkIn} />
            <Input label="Check-out" type="date" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} error={formErrors.checkOut} />
          </div>
          <Input label="Guests" type="number" value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} />
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <Button variant="outline" size="sm" onClick={() => setBookingOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" loading={submitting} onClick={handleBooking}>Confirm booking</Button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a review" size="md">
        <div className="space-y-4">
          <Input label="Your name" value={review.guestName} onChange={e => setReview(r => ({ ...r, guestName: e.target.value }))} required />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
            <StarRow rating={review.rating} onChange={val => setReview(r => ({ ...r, rating: val }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your experience</label>
            <textarea
              rows={3}
              value={review.comment}
              onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              placeholder="Share what made your stay special…"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <Button variant="outline" size="sm" onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" loading={submitting} onClick={handleReview}>Submit review</Button>
        </div>
      </Modal>

      <Footer />
    </div>
  )
}
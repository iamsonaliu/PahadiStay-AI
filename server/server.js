const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ─── In-memory data store ─────────────────────────────────
const homestays = [
  {
    _id: '1',
    name: 'Bugyali Homestay',
    village: 'Chopta',
    district: 'Rudraprayag',
    state: 'Uttarakhand',
    pricePerNight: 1800,
    averageRating: 4.8,
    totalReviews: 24,
    propertyType: 'Forest Cottage',
    amenities: ['Wi-Fi', 'Hot Water', 'Bonfire', 'Home-cooked Meals', 'Parking'],
    maxGuests: 4,
    description: 'A cozy forest cottage nestled amid dense rhododendron forests near Tungnath temple. Wake up to misty valley views and fresh mountain air.',
    imageUrls: ['https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=800&q=80'],
    ownerName: 'Ramesh Semwal',
    ownerContact: '+91-9876543210',
    available: true,
  },
  {
    _id: '2',
    name: 'Pahadi Nest',
    village: 'Munsiyari',
    district: 'Pithoragarh',
    state: 'Uttarakhand',
    pricePerNight: 2200,
    averageRating: 4.9,
    totalReviews: 18,
    propertyType: 'Mountain Bungalow',
    amenities: ['Wi-Fi', 'Hot Water', 'Trekking Guide', 'Home-cooked Meals', 'Garden'],
    maxGuests: 6,
    description: 'Panoramic views of Panchachuli peaks from this heritage bungalow. Ideal base for Milam Glacier and Khaliya Top treks.',
    imageUrls: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'],
    ownerName: 'Geeta Bisht',
    ownerContact: '+91-9876501234',
    available: true,
  },
  {
    _id: '3',
    name: 'Deodar House',
    village: 'Kanatal',
    district: 'Tehri Garhwal',
    state: 'Uttarakhand',
    pricePerNight: 1500,
    averageRating: 4.6,
    totalReviews: 31,
    propertyType: 'Village Cottage',
    amenities: ['Hot Water', 'Bonfire', 'Home-cooked Meals', 'Orchard Access'],
    maxGuests: 3,
    description: 'A quaint deodar-wood cottage surrounded by apple orchards at 8,500 ft. Perfect for a digital detox.',
    imageUrls: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'],
    ownerName: 'Dinesh Negi',
    ownerContact: '+91-9988776655',
    available: true,
  },
  {
    _id: '4',
    name: 'Riverside Camp',
    village: 'Lansdowne',
    district: 'Pauri Garhwal',
    state: 'Uttarakhand',
    pricePerNight: 1200,
    averageRating: 4.4,
    totalReviews: 12,
    propertyType: 'Riverside Camp',
    amenities: ['Bonfire', 'Home-cooked Meals', 'Fishing', 'Nature Walks'],
    maxGuests: 5,
    description: 'Set along the Khoh river with bird-watching and angling opportunities. A peaceful escape from city life.',
    imageUrls: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'],
    ownerName: 'Suresh Rawat',
    ownerContact: '+91-9123456780',
    available: true,
  },
  {
    _id: '5',
    name: 'Kumaoni Retreat',
    village: 'Kausani',
    district: 'Bageshwar',
    state: 'Uttarakhand',
    pricePerNight: 2500,
    averageRating: 4.7,
    totalReviews: 9,
    propertyType: 'Village Cottage',
    amenities: ['Wi-Fi', 'Hot Water', 'Telescope', 'Home-cooked Meals', 'Library'],
    maxGuests: 4,
    description: 'Gandhi called Kausani the Switzerland of India. This heritage cottage commands a breathtaking Trishul-Nanda Devi panorama.',
    imageUrls: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80'],
    ownerName: 'Kamla Pant',
    ownerContact: '+91-9456789012',
    available: true,
  },
  {
    _id: '6',
    name: 'Pangot Bird Lodge',
    village: 'Pangot',
    district: 'Nainital',
    state: 'Uttarakhand',
    pricePerNight: 3200,
    averageRating: 4.9,
    totalReviews: 41,
    propertyType: 'Forest Bungalow',
    amenities: ['Wi-Fi', 'Hot Water', 'Bird-watching Guides', 'Home-cooked Meals', 'Binoculars'],
    maxGuests: 6,
    description: 'Over 580 bird species recorded near this lodge. A paradise for ornithologists and nature lovers.',
    imageUrls: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'],
    ownerName: 'Prakash Joshi',
    ownerContact: '+91-9876123456',
    available: true,
  },
  {
    _id: '7',
    name: 'Valley View Cottage',
    village: 'Auli',
    district: 'Chamoli',
    state: 'Uttarakhand',
    pricePerNight: 2800,
    averageRating: 4.5,
    totalReviews: 15,
    propertyType: 'Mountain Bungalow',
    amenities: ['Wi-Fi', 'Hot Water', 'Ski Rental Help', 'Home-cooked Meals', 'Cable Car Access'],
    maxGuests: 4,
    description: 'India\'s premier ski destination. This cottage sits at 2,519m with unobstructed views of Nanda Devi.',
    imageUrls: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80'],
    ownerName: 'Virendra Singh',
    ownerContact: '+91-9345678901',
    available: true,
  },
  {
    _id: '8',
    name: 'Chakrata Forest Stay',
    village: 'Chakrata',
    district: 'Dehradun',
    state: 'Uttarakhand',
    pricePerNight: 1600,
    averageRating: 4.3,
    totalReviews: 8,
    propertyType: 'Forest Cottage',
    amenities: ['Hot Water', 'Bonfire', 'Jungle Walks', 'Home-cooked Meals'],
    maxGuests: 5,
    description: 'A restricted zone opened for eco-tourism. Dense oak and rhododendron forests with Tiger Falls just 5km away.',
    imageUrls: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80'],
    ownerName: 'Mohan Thapa',
    ownerContact: '+91-9234567890',
    available: true,
  },
]

const reviews = [
  { _id: 'r1', homestayId: '1', guestName: 'Priya Sharma', rating: 5, comment: 'Magical experience! The misty mornings near Tungnath were unforgettable. Ramesh bhai is an amazing host.', date: '2025-11-15' },
  { _id: 'r2', homestayId: '1', guestName: 'Vikram Tiwari', rating: 5, comment: 'Best stay in Chopta. Home-cooked food was exceptional, especially the kafuli and chainsoo.', date: '2025-10-22' },
  { _id: 'r3', homestayId: '2', guestName: 'Ananya Reddy', rating: 5, comment: 'Panchachuli views from the breakfast table. Words cannot describe it. Will be back!', date: '2025-12-01' },
  { _id: 'r4', homestayId: '3', guestName: 'Rohit Malhotra', rating: 4, comment: 'Very cozy cottage with great food. Wi-Fi was patchy but that\'s part of the charm.', date: '2025-09-10' },
  { _id: 'r5', homestayId: '6', guestName: 'Dr. Sunita Iyer', rating: 5, comment: 'Spotted over 40 species in 2 days! Prakash ji\'s knowledge of local birds is extraordinary.', date: '2025-11-30' },
]

const bookings = []
let nextId = 9
let nextBookingId = 1
let nextReviewId = 6

// ─── Routes ───────────────────────────────────────────────

// 1. GET /api/homestays — list all (with optional district & type filter)
app.get('/api/homestays', (req, res) => {
  const { district, type, minPrice, maxPrice } = req.query
  let results = [...homestays]

  if (district) results = results.filter(h => h.district.toLowerCase() === district.toLowerCase())
  if (type)     results = results.filter(h => h.propertyType.toLowerCase().includes(type.toLowerCase()))
  if (minPrice) results = results.filter(h => h.pricePerNight >= Number(minPrice))
  if (maxPrice) results = results.filter(h => h.pricePerNight <= Number(maxPrice))

  res.status(200).json({ success: true, count: results.length, data: results })
})

// 2. GET /api/homestays/search — search by keyword
app.get('/api/homestays/search', (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) {
    return res.status(400).json({ success: false, message: 'Search query "q" is required' })
  }
  const query = q.toLowerCase()
  const results = homestays.filter(h =>
    h.name.toLowerCase().includes(query) ||
    h.village.toLowerCase().includes(query) ||
    h.district.toLowerCase().includes(query) ||
    h.propertyType.toLowerCase().includes(query) ||
    h.description.toLowerCase().includes(query)
  )
  res.status(200).json({ success: true, count: results.length, query: q, data: results })
})

// 3. GET /api/homestays/:id — get single homestay
app.get('/api/homestays/:id', (req, res) => {
  const homestay = homestays.find(h => h._id === req.params.id)
  if (!homestay) {
    return res.status(404).json({ success: false, message: 'Homestay not found' })
  }
  const homestayReviews = reviews.filter(r => r.homestayId === req.params.id)
  res.status(200).json({ success: true, data: { ...homestay, reviews: homestayReviews } })
})

// 4. POST /api/homestays — create new homestay listing
app.post('/api/homestays', (req, res) => {
  const { name, village, district, pricePerNight, propertyType, ownerName, ownerContact } = req.body

  if (!name || !village || !district || !pricePerNight || !propertyType || !ownerName) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: name, village, district, pricePerNight, propertyType, ownerName',
    })
  }

  const newHomestay = {
    _id: String(nextId++),
    name,
    village,
    district,
    state: 'Uttarakhand',
    pricePerNight: Number(pricePerNight),
    averageRating: 0,
    totalReviews: 0,
    propertyType,
    amenities: req.body.amenities || [],
    maxGuests: req.body.maxGuests || 2,
    description: req.body.description || '',
    imageUrls: req.body.imageUrls || [],
    ownerName,
    ownerContact: ownerContact || '',
    available: true,
  }

  homestays.push(newHomestay)
  res.status(201).json({ success: true, message: 'Homestay created successfully', data: newHomestay })
})

// 5. PUT /api/homestays/:id — update homestay
app.put('/api/homestays/:id', (req, res) => {
  const index = homestays.findIndex(h => h._id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Homestay not found' })
  }

  const updatable = ['name', 'village', 'district', 'pricePerNight', 'propertyType', 'amenities', 'maxGuests', 'description', 'imageUrls', 'ownerName', 'ownerContact', 'available']
  updatable.forEach(field => {
    if (req.body[field] !== undefined) homestays[index][field] = req.body[field]
  })

  res.status(200).json({ success: true, message: 'Homestay updated', data: homestays[index] })
})

// 6. DELETE /api/homestays/:id — delete homestay
app.delete('/api/homestays/:id', (req, res) => {
  const index = homestays.findIndex(h => h._id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Homestay not found' })
  }
  homestays.splice(index, 1)
  res.status(204).send()
})

// 7. GET /api/homestays/:id/reviews — get reviews for a homestay
app.get('/api/homestays/:id/reviews', (req, res) => {
  const homestay = homestays.find(h => h._id === req.params.id)
  if (!homestay) {
    return res.status(404).json({ success: false, message: 'Homestay not found' })
  }
  const homestayReviews = reviews.filter(r => r.homestayId === req.params.id)
  res.status(200).json({ success: true, count: homestayReviews.length, data: homestayReviews })
})

// 8. POST /api/homestays/:id/reviews — add a review
app.post('/api/homestays/:id/reviews', (req, res) => {
  const homestay = homestays.find(h => h._id === req.params.id)
  if (!homestay) {
    return res.status(404).json({ success: false, message: 'Homestay not found' })
  }

  const { guestName, rating, comment } = req.body
  if (!guestName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Required fields: guestName, rating, comment' })
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' })
  }

  const newReview = {
    _id: `r${nextReviewId++}`,
    homestayId: req.params.id,
    guestName,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
  }
  reviews.push(newReview)

  // recalculate average rating
  const homestayReviews = reviews.filter(r => r.homestayId === req.params.id)
  const avg = homestayReviews.reduce((sum, r) => sum + r.rating, 0) / homestayReviews.length
  homestay.averageRating = Math.round(avg * 10) / 10
  homestay.totalReviews = homestayReviews.length

  res.status(201).json({ success: true, message: 'Review added', data: newReview })
})

// 9. GET /api/bookings — list all bookings
app.get('/api/bookings', (req, res) => {
  res.status(200).json({ success: true, count: bookings.length, data: bookings })
})

// 10. POST /api/bookings — create a booking enquiry
app.post('/api/bookings', (req, res) => {
  const { homestayId, guestName, guestEmail, checkIn, checkOut, guests } = req.body

  if (!homestayId || !guestName || !guestEmail || !checkIn || !checkOut || !guests) {
    return res.status(400).json({
      success: false,
      message: 'Required: homestayId, guestName, guestEmail, checkIn, checkOut, guests',
    })
  }

  const homestay = homestays.find(h => h._id === homestayId)
  if (!homestay) {
    return res.status(404).json({ success: false, message: 'Homestay not found' })
  }

  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  if (nights <= 0) {
    return res.status(400).json({ success: false, message: 'Check-out must be after check-in' })
  }

  const booking = {
    _id: `b${nextBookingId++}`,
    homestayId,
    homestayName: homestay.name,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    nights,
    guests: Number(guests),
    totalAmount: nights * homestay.pricePerNight,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  bookings.push(booking)
  res.status(201).json({ success: true, message: 'Booking enquiry submitted', data: booking })
})

// 11. GET /api/stats — platform-level stats (extra endpoint)
app.get('/api/stats', (req, res) => {
  const totalHomestays = homestays.length
  const avgPrice = Math.round(homestays.reduce((s, h) => s + h.pricePerNight, 0) / totalHomestays)
  const avgRating = (homestays.reduce((s, h) => s + h.averageRating, 0) / totalHomestays).toFixed(1)
  const districts = [...new Set(homestays.map(h => h.district))].length

  res.status(200).json({
    success: true,
    data: {
      totalHomestays,
      totalReviews: reviews.length,
      totalBookings: bookings.length,
      avgPricePerNight: avgPrice,
      avgRating: Number(avgRating),
      districtsRepresented: districts,
    },
  })
})

// ─── Error handling middleware ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message })
})

// ─── Start server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`PahadiStay API running on http://localhost:${PORT}`)
})

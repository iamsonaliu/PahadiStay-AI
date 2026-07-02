const mongoose = require('mongoose')
const { isMongoConnected } = require('../config/db')
const seed = require('../data/seed')
const User = require('../models/User')
const Homestay = require('../models/Homestay')
const Booking = require('../models/Booking')
const Review = require('../models/Review')

const clone = value => JSON.parse(JSON.stringify(value))
const memory = {
  homestays: clone(seed.homestays),
  reviews: clone(seed.reviews),
  bookings: clone(seed.bookings),
  users: clone(seed.users),
}

let nextHomestayId = Math.max(...memory.homestays.map(h => Number(h._id)).filter(Boolean), 8) + 1
let nextBookingId = 1
let nextReviewId = Math.max(...memory.reviews.map(r => Number(String(r._id).replace('r', ''))).filter(Boolean), 5) + 1
let nextUserId = 1

const toJSON = doc => (doc && typeof doc.toJSON === 'function' ? doc.toJSON() : doc)
const safeUser = user => {
  if (!user) return null
  const data = toJSON(user)
  const copy = { ...data }
  if (copy._id && typeof copy._id !== 'string') copy._id = copy._id.toString()
  delete copy.passwordHash
  return copy
}

const buildHomestayQuery = (filter = {}) => {
  const query = {}
  if (filter.district) query.district = new RegExp(`^${escapeRegex(filter.district)}$`, 'i')
  if (filter.type) query.propertyType = new RegExp(escapeRegex(filter.type), 'i')
  if (filter.category) query.category = new RegExp(`^${escapeRegex(filter.category)}$`, 'i')
  if (filter.minPrice || filter.maxPrice) {
    query.pricePerNight = {}
    if (filter.minPrice) query.pricePerNight.$gte = Number(filter.minPrice)
    if (filter.maxPrice) query.pricePerNight.$lte = Number(filter.maxPrice)
  }
  return query
}

const escapeRegex = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const applyMemoryFilters = (items, filter = {}) => items.filter(h => {
  if (filter.district && h.district.toLowerCase() !== String(filter.district).toLowerCase()) return false
  if (filter.type && !h.propertyType.toLowerCase().includes(String(filter.type).toLowerCase())) return false
  if (filter.category && String(h.category || '').toLowerCase() !== String(filter.category).toLowerCase()) return false
  if (filter.minPrice && h.pricePerNight < Number(filter.minPrice)) return false
  if (filter.maxPrice && h.pricePerNight > Number(filter.maxPrice)) return false
  return true
})

const paginate = (items, { page, limit } = {}) => {
  if (!page && !limit) return { data: items, meta: undefined }
  const pageNum = Math.max(Number(page) || 1, 1)
  const limitNum = Math.max(Number(limit) || 10, 1)
  const start = (pageNum - 1) * limitNum
  return {
    data: items.slice(start, start + limitNum),
    meta: { page: pageNum, limit: limitNum, total: items.length, pages: Math.ceil(items.length / limitNum) || 1 },
  }
}

const listHomestays = async (filter = {}) => {
  if (isMongoConnected()) {
    const query = buildHomestayQuery(filter)
    const all = await Homestay.find(query).sort({ createdAt: -1, _id: 1 })
    const { data, meta } = paginate(all.map(toJSON), filter)
    return { data, meta, total: all.length }
  }
  const filtered = applyMemoryFilters(memory.homestays, filter)
  const { data, meta } = paginate(filtered, filter)
  return { data: clone(data), meta, total: filtered.length }
}

const searchHomestays = async q => {
  const query = String(q || '').toLowerCase()
  if (isMongoConnected()) {
    const regex = new RegExp(escapeRegex(q), 'i')
    return (await Homestay.find({ $or: [{ name: regex }, { village: regex }, { district: regex }, { propertyType: regex }, { description: regex }] })).map(toJSON)
  }
  return clone(memory.homestays.filter(h =>
    h.name.toLowerCase().includes(query) ||
    h.village.toLowerCase().includes(query) ||
    h.district.toLowerCase().includes(query) ||
    h.propertyType.toLowerCase().includes(query) ||
    h.description.toLowerCase().includes(query)
  ))
}

const getHomestay = async id => {
  if (isMongoConnected()) {
    return toJSON(await Homestay.findById(id))
  }
  return clone(memory.homestays.find(h => h._id === String(id)) || null)
}

const createHomestay = async input => {
  if (isMongoConnected()) return toJSON(await Homestay.create(input))
  const homestay = {
    _id: String(nextHomestayId++),
    state: 'Uttarakhand',
    averageRating: 0,
    totalReviews: 0,
    amenities: [],
    maxGuests: 2,
    description: '',
    imageUrls: [],
    ownerContact: '',
    category: 'Nature Eco',
    available: true,
    ...clone(input),
    pricePerNight: Number(input.pricePerNight),
  }
  memory.homestays.push(homestay)
  return clone(homestay)
}

const updateHomestay = async (id, updates) => {
  if (isMongoConnected()) {
    return toJSON(await Homestay.findByIdAndUpdate(id, updates, { new: true, runValidators: true }))
  }
  const index = memory.homestays.findIndex(h => h._id === String(id))
  if (index === -1) return null
  Object.assign(memory.homestays[index], clone(updates))
  return clone(memory.homestays[index])
}

const deleteHomestay = async id => {
  if (isMongoConnected()) {
    const deleted = await Homestay.findByIdAndDelete(id)
    if (deleted) await Review.deleteMany({ homestayId: id })
    return Boolean(deleted)
  }
  const index = memory.homestays.findIndex(h => h._id === String(id))
  if (index === -1) return false
  memory.homestays.splice(index, 1)
  return true
}

const listReviews = async homestayId => {
  if (isMongoConnected()) return (await Review.find(homestayId ? { homestayId } : {}).sort({ date: -1 })).map(toJSON)
  const rows = homestayId ? memory.reviews.filter(r => r.homestayId === String(homestayId)) : memory.reviews
  return clone(rows)
}

const recomputeRating = async homestayId => {
  const homestayReviews = await listReviews(homestayId)
  if (!homestayReviews.length) return updateHomestay(homestayId, { averageRating: 0, totalReviews: 0 })
  const avg = homestayReviews.reduce((sum, r) => sum + Number(r.rating), 0) / homestayReviews.length
  return updateHomestay(homestayId, { averageRating: Math.round(avg * 10) / 10, totalReviews: homestayReviews.length })
}

const addReview = async (homestayId, input) => {
  if (isMongoConnected()) {
    const review = await Review.create({ ...input, homestayId, rating: Number(input.rating), date: input.date || new Date().toISOString().split('T')[0] })
    await recomputeRating(homestayId)
    return toJSON(review)
  }
  const review = {
    _id: `r${nextReviewId++}`,
    homestayId: String(homestayId),
    guestName: input.guestName,
    rating: Number(input.rating),
    comment: input.comment,
    date: input.date || new Date().toISOString().split('T')[0],
  }
  if (input.dimensions) review.dimensions = clone(input.dimensions)
  memory.reviews.push(review)
  await recomputeRating(homestayId)
  return clone(review)
}

const listBookings = async () => {
  if (isMongoConnected()) return (await Booking.find().sort({ createdAt: -1 })).map(toJSON)
  return clone(memory.bookings)
}

const createBooking = async input => {
  if (isMongoConnected()) return toJSON(await Booking.create(input))
  const booking = { _id: `b${nextBookingId++}`, ...clone(input), createdAt: new Date().toISOString() }
  memory.bookings.push(booking)
  return clone(booking)
}

const getStats = async () => {
  const { data: homestays } = await listHomestays({})
  const reviews = await listReviews()
  const bookings = await listBookings()
  const totalHomestays = homestays.length
  const avgPricePerNight = totalHomestays ? Math.round(homestays.reduce((s, h) => s + Number(h.pricePerNight || 0), 0) / totalHomestays) : 0
  const avgRating = totalHomestays ? Number((homestays.reduce((s, h) => s + Number(h.averageRating || 0), 0) / totalHomestays).toFixed(1)) : 0
  return {
    totalHomestays,
    totalReviews: reviews.length,
    totalBookings: bookings.length,
    avgPricePerNight,
    avgRating,
    districtsRepresented: new Set(homestays.map(h => h.district)).size,
  }
}

const createUser = async input => {
  if (isMongoConnected()) return safeUser(await User.create(input))
  const exists = memory.users.find(u => u.email.toLowerCase() === input.email.toLowerCase())
  if (exists) throw Object.assign(new Error('Email already registered'), { code: 'DUPLICATE_EMAIL' })
  const user = { _id: `u${nextUserId++}`, role: 'traveller', phone: '', ...clone(input), createdAt: new Date().toISOString() }
  memory.users.push(user)
  return safeUser(user)
}

const findUserByEmail = async (email, includePassword = false) => {
  if (isMongoConnected()) {
    if (includePassword) {
      const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash').lean()
      if (!user) return null
      return { ...user, _id: user._id.toString() }
    }
    return safeUser(await User.findOne({ email: String(email).toLowerCase() }))
  }
  const user = memory.users.find(u => u.email.toLowerCase() === String(email).toLowerCase())
  if (!user) return null
  return includePassword ? clone(user) : safeUser(user)
}

const findUserById = async id => {
  if (isMongoConnected()) {
    return safeUser(await User.findById(id))
  }
  return safeUser(memory.users.find(u => u._id === String(id)) || null)
}

module.exports = {
  listHomestays,
  searchHomestays,
  getHomestay,
  createHomestay,
  updateHomestay,
  deleteHomestay,
  listReviews,
  addReview,
  listBookings,
  createBooking,
  getStats,
  createUser,
  findUserByEmail,
  findUserById,
}

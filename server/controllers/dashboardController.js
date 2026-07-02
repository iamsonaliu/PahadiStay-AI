const dataStore = require('../services/dataStore')
const geminiService = require('../services/geminiService')
const { asyncHandler, successResponse } = require('../utils/helpers')

const monthKey = date => new Date(date).toISOString().slice(0, 7)

const overview = asyncHandler(async (_req, res) => {
  const { data: homestays } = await dataStore.listHomestays({})
  const bookings = await dataStore.listBookings()
  const reviews = await dataStore.listReviews()
  const stats = await dataStore.getStats()
  const capacityNights = Math.max(homestays.reduce((sum, h) => sum + Number(h.maxGuests || 0), 0) * 30, 1)
  const bookedGuestNights = bookings.reduce((sum, b) => sum + (Number(b.guests || 0) * Number(b.nights || 0)), 0)
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({ rating, count: reviews.filter(r => Math.round(Number(r.rating)) === rating).length }))
  const trendMap = new Map()
  bookings.forEach(b => {
    const key = monthKey(b.createdAt || new Date())
    trendMap.set(key, (trendMap.get(key) || 0) + 1)
  })
  const now = new Date()
  const monthlyBookingTrend = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1)
    const key = d.toISOString().slice(0, 7)
    return { month: key, bookings: trendMap.get(key) || 0 }
  })
  const summary = await geminiService.monthlySummary({ ...stats, recentBookings: bookings.slice(-5) })
  successResponse(res, {
    totals: stats,
    occupancyEstimate: Number(Math.min((bookedGuestNights / capacityNights) * 100, 100).toFixed(1)),
    recentBookings: bookings.slice(-5).reverse(),
    monthlyBookingTrend,
    ratingDistribution,
    summary,
  })
})

module.exports = { overview }

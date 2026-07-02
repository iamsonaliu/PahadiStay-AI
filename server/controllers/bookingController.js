const dataStore = require('../services/dataStore')
const { sendBookingNotification } = require('../services/mailService')
const { asyncHandler, ApiError, successResponse } = require('../utils/helpers')

const listBookings = asyncHandler(async (_req, res) => {
  const bookings = await dataStore.listBookings()
  successResponse(res, bookings, { count: bookings.length })
})

const createBooking = asyncHandler(async (req, res) => {
  const { homestayId, guestName, guestEmail, checkIn, checkOut, guests } = req.body
  if (!homestayId || !guestName || !guestEmail || !checkIn || !checkOut || !guests) {
    throw new ApiError('Required: homestayId, guestName, guestEmail, checkIn, checkOut, guests', 400)
  }
  const homestay = await dataStore.getHomestay(homestayId)
  if (!homestay) throw new ApiError('Homestay not found', 404)
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  if (nights <= 0 || Number.isNaN(nights)) throw new ApiError('Check-out must be after check-in', 400)

  const booking = await dataStore.createBooking({
    homestayId,
    homestayName: homestay.name,
    guestName,
    guestEmail,
    guestPhone: req.body.guestPhone || '',
    checkIn,
    checkOut,
    nights,
    guests: Number(guests),
    totalAmount: nights * homestay.pricePerNight,
    status: 'pending',
    specialRequests: req.body.specialRequests || '',
  })
  sendBookingNotification(booking).catch(error => console.warn(`Booking notification skipped: ${error.message}`))
  successResponse(res, booking, { statusCode: 201, message: 'Booking enquiry submitted' })
})

module.exports = { listBookings, createBooking }

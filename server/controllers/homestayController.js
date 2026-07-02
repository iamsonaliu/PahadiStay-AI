const dataStore = require('../services/dataStore')
const { asyncHandler, ApiError, successResponse } = require('../utils/helpers')

const listHomestays = asyncHandler(async (req, res) => {
  const { district, type, minPrice, maxPrice, category, page, limit } = req.query
  const result = await dataStore.listHomestays({ district, type, minPrice, maxPrice, category, page, limit })
  successResponse(res, result.data, { count: result.data.length, meta: result.meta })
})

const searchHomestays = asyncHandler(async (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) throw new ApiError('Search query "q" is required', 400)
  const results = await dataStore.searchHomestays(q)
  res.status(200).json({ success: true, count: results.length, query: q, data: results })
})

const getHomestay = asyncHandler(async (req, res) => {
  const homestay = await dataStore.getHomestay(req.params.id)
  if (!homestay) throw new ApiError('Homestay not found', 404)
  const reviews = await dataStore.listReviews(req.params.id)
  successResponse(res, { ...homestay, reviews })
})

const createHomestay = asyncHandler(async (req, res) => {
  const { name, village, district, pricePerNight, propertyType, ownerName, ownerContact } = req.body
  if (!name || !village || !district || !pricePerNight || !propertyType || !ownerName) {
    throw new ApiError('Required fields: name, village, district, pricePerNight, propertyType, ownerName', 400)
  }
  const homestay = await dataStore.createHomestay({
    ...req.body,
    owner: req.user?._id,
    name,
    village,
    district,
    pricePerNight: Number(pricePerNight),
    propertyType,
    ownerName,
    ownerContact: ownerContact || '',
  })
  successResponse(res, homestay, { statusCode: 201, message: 'Homestay created successfully' })
})

const updateHomestay = asyncHandler(async (req, res) => {
  const updatable = ['name', 'village', 'district', 'pricePerNight', 'propertyType', 'category', 'amenities', 'maxGuests', 'description', 'imageUrls', 'ownerName', 'ownerContact', 'available', 'geo']
  const updates = {}
  updatable.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field] })
  if (updates.pricePerNight !== undefined) updates.pricePerNight = Number(updates.pricePerNight)
  const homestay = await dataStore.updateHomestay(req.params.id, updates)
  if (!homestay) throw new ApiError('Homestay not found', 404)
  successResponse(res, homestay, { message: 'Homestay updated' })
})

const deleteHomestay = asyncHandler(async (req, res) => {
  const deleted = await dataStore.deleteHomestay(req.params.id)
  if (!deleted) throw new ApiError('Homestay not found', 404)
  res.status(204).send()
})

const listReviews = asyncHandler(async (req, res) => {
  const homestay = await dataStore.getHomestay(req.params.id)
  if (!homestay) throw new ApiError('Homestay not found', 404)
  const reviews = await dataStore.listReviews(req.params.id)
  successResponse(res, reviews, { count: reviews.length })
})

const addReview = asyncHandler(async (req, res) => {
  const homestay = await dataStore.getHomestay(req.params.id)
  if (!homestay) throw new ApiError('Homestay not found', 404)
  const { guestName, rating, comment } = req.body
  if (!guestName || !rating || !comment) throw new ApiError('Required fields: guestName, rating, comment', 400)
  if (Number(rating) < 1 || Number(rating) > 5) throw new ApiError('Rating must be between 1 and 5', 400)
  const review = await dataStore.addReview(req.params.id, { guestName, rating, comment, dimensions: req.body.dimensions })
  successResponse(res, review, { statusCode: 201, message: 'Review added' })
})

module.exports = { listHomestays, searchHomestays, getHomestay, createHomestay, updateHomestay, deleteHomestay, listReviews, addReview }

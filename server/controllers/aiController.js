const dataStore = require('../services/dataStore')
const recommendationService = require('../services/recommendationService')
const reviewAnalysisService = require('../services/reviewAnalysisService')
const { asyncHandler, ApiError, successResponse } = require('../utils/helpers')

const recommend = asyncHandler(async (req, res) => {
  const { data: homestays } = await dataStore.listHomestays({ district: req.body.district })
  const result = await recommendationService.recommendHomestays(req.body || {}, homestays)
  successResponse(res, result)
})

const analyzeReviews = asyncHandler(async (req, res) => {
  const { homestayId } = req.body
  if (!homestayId) throw new ApiError('homestayId is required', 400)
  const homestay = await dataStore.getHomestay(homestayId)
  if (!homestay) throw new ApiError('Homestay not found', 404)
  const reviews = await dataStore.listReviews(homestayId)
  successResponse(res, await reviewAnalysisService.analyzeReviews(reviews))
})

module.exports = { recommend, analyzeReviews }

const dataStore = require('../services/dataStore')
const { asyncHandler, successResponse } = require('../utils/helpers')

const listAllReviews = asyncHandler(async (_req, res) => {
  const reviews = await dataStore.listReviews()
  successResponse(res, reviews, { count: reviews.length })
})

module.exports = { listAllReviews }

const geminiService = require('../services/geminiService')
const { asyncHandler, successResponse } = require('../utils/helpers')

const planTrip = asyncHandler(async (req, res) => {
  const result = await geminiService.planTrip(req.body || {})
  successResponse(res, result)
})

module.exports = { planTrip }

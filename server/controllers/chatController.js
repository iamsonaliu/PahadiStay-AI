const geminiService = require('../services/geminiService')
const { asyncHandler, ApiError, successResponse } = require('../utils/helpers')

const chat = asyncHandler(async (req, res) => {
  if (!req.body.message) throw new ApiError('message is required', 400)
  successResponse(res, await geminiService.chat({ message: req.body.message, history: req.body.history || [] }))
})

module.exports = { chat }

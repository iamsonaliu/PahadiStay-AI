const dataStore = require('../services/dataStore')
const { asyncHandler, successResponse } = require('../utils/helpers')

const getStats = asyncHandler(async (_req, res) => successResponse(res, await dataStore.getStats()))

module.exports = { getStats }

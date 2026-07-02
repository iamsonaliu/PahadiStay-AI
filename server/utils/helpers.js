class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

const successResponse = (res, data, { statusCode = 200, message, count, meta } = {}) => {
  const body = { success: true }
  if (message) body.message = message
  if (count !== undefined) body.count = count
  if (meta) body.meta = meta
  body.data = data
  return res.status(statusCode).json(body)
}

const failResponse = (res, message, statusCode = 500) => res.status(statusCode).json({ success: false, message })

module.exports = { ApiError, asyncHandler, successResponse, failResponse }

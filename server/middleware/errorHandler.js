const { failResponse } = require('../utils/helpers')

const notFound = (req, _res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`)
  error.statusCode = 404
  next(error)
}

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500)
  const message = err.code === 11000 ? 'Email already registered' : err.message || 'Internal server error'
  if (process.env.NODE_ENV !== 'test') console.error(err.stack || err.message)
  return failResponse(res, message, statusCode)
}

module.exports = { notFound, errorHandler }

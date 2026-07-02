const { ApiError } = require('../utils/helpers')

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError('Authentication required', 401))
  if (!roles.includes(req.user.role)) return next(new ApiError('Forbidden: insufficient role', 403))
  return next()
}

module.exports = { requireRole }

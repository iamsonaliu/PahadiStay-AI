const jwt = require('jsonwebtoken')
const dataStore = require('../services/dataStore')
const { ApiError, asyncHandler } = require('../utils/helpers')

const JWT_SECRET = () => process.env.JWT_SECRET || 'pahadistay-dev-secret-change-me'

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new ApiError('Not authorized, token missing', 401)

  try {
    const decoded = jwt.verify(token, JWT_SECRET())
    const user = await dataStore.findUserById(decoded.id)
    if (!user) throw new ApiError('Not authorized, user not found', 401)
    req.user = user
    next()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError('Not authorized, token invalid', 401)
  }
})

const signToken = user => jwt.sign({ id: user._id, role: user.role }, JWT_SECRET(), { expiresIn: '7d' })

module.exports = { protect, signToken }

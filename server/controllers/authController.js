const bcrypt = require('bcryptjs')
const dataStore = require('../services/dataStore')
const { asyncHandler, ApiError, successResponse } = require('../utils/helpers')
const { signToken } = require('../middleware/authMiddleware')

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'traveller', phone = '' } = req.body
  if (!name || !email || !password) throw new ApiError('Required fields: name, email, password', 400)
  if (!['traveller', 'owner', 'admin'].includes(role)) throw new ApiError('Invalid role', 400)
  if (await dataStore.findUserByEmail(email)) throw new ApiError('Email already registered', 409)

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await dataStore.createUser({ name, email: String(email).toLowerCase(), passwordHash, role, phone })
  const token = signToken(user)
  successResponse(res, { user, token }, { statusCode: 201, message: 'Registered successfully' })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError('Required fields: email, password', 400)
  const userWithPassword = await dataStore.findUserByEmail(email, true)
  if (!userWithPassword || !(await bcrypt.compare(password, userWithPassword.passwordHash))) {
    throw new ApiError('Invalid email or password', 401)
  }
  const { passwordHash, ...user } = userWithPassword
  const token = signToken(user)
  successResponse(res, { user, token }, { message: 'Logged in successfully' })
})

const getMe = asyncHandler(async (req, res) => successResponse(res, req.user))

module.exports = { register, login, getMe }

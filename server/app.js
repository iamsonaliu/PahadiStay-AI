const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')

const authRoutes = require('./routes/authRoutes')
const homestayRoutes = require('./routes/homestayRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const plannerRoutes = require('./routes/plannerRoutes')
const chatRoutes = require('./routes/chatRoutes')
const aiRoutes = require('./routes/aiRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const statsRoutes = require('./routes/statsRoutes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '1mb' }))

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}))

app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok', service: 'PahadiStay AI API' } }))
app.use('/api/auth', authRoutes)
app.use('/api/homestays', homestayRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/stats', statsRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app

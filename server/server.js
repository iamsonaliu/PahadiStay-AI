const dotenv = require('dotenv')
dotenv.config()

const app = require('./app')
const { connectDB } = require('./config/db')

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log('──────────────────────────────────────────')
    console.log(`PahadiStay API running on http://localhost:${PORT}`)
    console.log('──────────────────────────────────────────')
  })
}

start().catch(error => {
  console.error('Failed to start PahadiStay API:', error)
  process.exit(1)
})

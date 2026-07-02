const mongoose = require('mongoose')

let mongoConnected = false

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set. PahadiStay API is running in IN-MEMORY mode.')
    mongoConnected = false
    return false
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    mongoConnected = true
    console.log('✅ MongoDB connected. PahadiStay API is running in MONGO mode.')
    return true
  } catch (error) {
    mongoConnected = false
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`)
    console.warn('⚠️  Falling back to IN-MEMORY mode. Data resets when the process restarts.')
    return false
  }
}

const isMongoConnected = () => mongoConnected && mongoose.connection.readyState === 1

module.exports = { connectDB, isMongoConnected }

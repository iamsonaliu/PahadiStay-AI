const dotenv = require('dotenv')
const mongoose = require('mongoose')
const seed = require('../data/seed')
const Homestay = require('../models/Homestay')
const Review = require('../models/Review')

dotenv.config()

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required to seed MongoDB')
  await mongoose.connect(process.env.MONGO_URI)
  await Promise.all([Homestay.deleteMany({}), Review.deleteMany({})])
  const homestays = await Homestay.insertMany(seed.homestays)
  await Review.insertMany(seed.reviews)
  console.log(`Seeded ${homestays.length} homestays and ${seed.reviews.length} reviews.`)
  await mongoose.disconnect()
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})

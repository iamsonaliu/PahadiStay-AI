/**
 * seedFromDataset.js
 *
 * Seeds the Homestay + Review collections in MongoDB Atlas from
 * server/data/uttarakhand.dataset.json — the aggregated dataset that
 * scripts/build_dataset.py already built from Uttarakhand_HomeStay_Reviews.csv
 * + project_data_500.xlsx (50 homestays, ~390 reviews, fields already
 * matching the Mongoose schema almost exactly).
 *
 * This is the recommended seed script for Week 5: the dataset file is
 * already schema-shaped, so there's no need to reconstruct or guess at
 * missing homestay fields the way a raw-CSV import would have to.
 *
 * Run with:  npm run seed:dataset   (from /server)
 * Requires:  MONGO_URI set in server/.env
 */

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const Homestay = require('../models/Homestay')
const Review = require('../models/Review')

const DATASET_PATH = path.join(__dirname, '../data/uttarakhand.dataset.json')
const VALID_CATEGORIES = ['Adventure', 'Wildlife', 'Char Dham', 'Nature Eco', 'Religious', 'Camping', 'Trekking', 'Heritage', 'Wellness', 'Village Life']

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required. Set it in server/.env first.')
  if (!fs.existsSync(DATASET_PATH)) throw new Error(`Dataset not found at ${DATASET_PATH}. Did you pull the latest data/ folder?`)

  const raw = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'))
  console.log(`Loaded dataset: ${raw.homestays.length} homestays, ${raw.reviews.length} reviews.`)
  console.log(`Source note: ${raw.note}`)

  console.log('Connecting to MongoDB Atlas...')
  await mongoose.connect(process.env.MONGO_URI)

  console.log('Clearing existing Homestay and Review collections...')
  await Promise.all([Homestay.deleteMany({}), Review.deleteMany({})])

  // the dataset's own ids (e.g. "h1000") need to map to real Mongo _ids
  // so that reviews link to the correct homestay after insertion.
  const idMap = {}
  let invalidCategoryCount = 0

  for (const h of raw.homestays) {
    const category = VALID_CATEGORIES.includes(h.category) ? h.category : (invalidCategoryCount++, 'Nature Eco')
    const { _id: oldId, category_source, source, ...rest } = h
    const homestay = await Homestay.create({ ...rest, category })
    idMap[oldId] = homestay._id
  }
  console.log(`Inserted ${raw.homestays.length} homestays.` + (invalidCategoryCount ? ` (${invalidCategoryCount} had a category outside the schema enum, remapped to "Nature Eco")` : ''))

  const reviewDocs = raw.reviews
    .filter(r => idMap[r.homestayId])
    .map(({ _id, sentiment, topic, homestayId, ...rest }) => ({
      ...rest,
      homestayId: idMap[homestayId],
    }))

  await Review.insertMany(reviewDocs)
  console.log(`Inserted ${reviewDocs.length} reviews.`)

  // recompute averageRating/totalReviews per homestay from the reviews actually imported
  for (const oldId of Object.keys(idMap)) {
    const mongoId = idMap[oldId]
    const reviews = await Review.find({ homestayId: mongoId })
    if (reviews.length) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      await Homestay.findByIdAndUpdate(mongoId, { averageRating: Math.round(avg * 10) / 10, totalReviews: reviews.length })
    }
  }
  console.log('Recomputed averageRating/totalReviews from imported reviews.')

  console.log(`\nDone. Atlas now has ${raw.homestays.length} homestays and ${reviewDocs.length} reviews.`)
  await mongoose.disconnect()
}

run().catch(error => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
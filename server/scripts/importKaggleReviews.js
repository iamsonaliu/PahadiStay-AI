/**
 * importKaggleReviews.js
 *
 * Replaces the hand-written seed data with the Kaggle "Uttarakhand HomeStay
 * Reviews" dataset (server/data/Uttarakhand_HomeStay_Reviews.csv).
 *
 * WHY THIS SCRIPT EXISTS (read before running):
 * The raw CSV only contains review-level fields (review_id, homestay_id,
 * homestay_name, district, rating, review_text, ...). It does NOT contain
 * homestay-level fields our Homestay schema needs (village, pricePerNight,
 * propertyType, ownerName, etc.), and in this synthetic dataset homestay_id
 * is not a reliable key — the same homestay_id appears with many different
 * homestay_name/district combinations (a known quirk of this Kaggle dataset).
 *
 * So this script:
 *  1. Groups all 3,500 reviews by the 15 unique `homestay_name` values
 *     (the most stable field in the file).
 *  2. For each of the 15 names, builds ONE Homestay document using the
 *     most frequent district for that name, plus deterministic
 *     (non-random / reproducible) values for the fields the CSV doesn't
 *     provide — village, propertyType, category, ownerName, pricePerNight,
 *     amenities, geo.
 *  3. Imports every CSV row as a Review document linked to the generated
 *     Homestay's real Mongo _id.
 *  4. Recomputes averageRating/totalReviews on each Homestay from its
 *     actual imported reviews.
 *
 * Run with:  npm run import:kaggle   (from /server)
 * Requires:  MONGO_URI set in server/.env
 */

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const Homestay = require('../models/Homestay')
const Review = require('../models/Review')

const CSV_PATH = path.join(__dirname, '../data/Uttarakhand_HomeStay_Reviews.csv')

// ---- deterministic lookup tables (no randomness => reproducible imports) ----

const VILLAGE_BY_DISTRICT = {
  'Chamoli': 'Joshimath',
  'Almora': 'Kasar Devi',
  'Uttarkashi': 'Harsil',
  'Tehri Garhwal': 'Chamba',
  'Rudraprayag': 'Chopta',
  'Nainital': 'Bhimtal',
  'Mukteshwar': 'Mukteshwar',
  'Pithoragarh': 'Munsiyari',
  'Kausani': 'Kausani',
  'Ranikhet': 'Ranikhet',
}

const GEO_BY_DISTRICT = {
  'Chamoli': { lat: 30.4900, lng: 79.5800 },
  'Almora': { lat: 29.6900, lng: 79.6600 },
  'Uttarkashi': { lat: 30.7300, lng: 78.4500 },
  'Tehri Garhwal': { lat: 30.3900, lng: 78.4800 },
  'Rudraprayag': { lat: 30.4900, lng: 79.1500 },
  'Nainital': { lat: 29.3900, lng: 79.4500 },
  'Mukteshwar': { lat: 29.4700, lng: 79.6500 },
  'Pithoragarh': { lat: 29.8300, lng: 80.2000 },
  'Kausani': { lat: 29.8400, lng: 79.6000 },
  'Ranikhet': { lat: 29.6400, lng: 79.4300 },
}

const PROPERTY_TYPES = ['Homestay', 'Cottage', 'Guest House', 'Farm Stay']
const CATEGORIES = ['Nature Eco', 'Trekking', 'Heritage', 'Wellness', 'Village Life', 'Camping']
const OWNER_NAMES = [
  'Ramesh Semwal', 'Geeta Rawat', 'Vinod Bisht', 'Kamla Negi', 'Suresh Panwar',
  'Anita Pant', 'Mohan Rana', 'Deepa Joshi', 'Pradeep Adhikari', 'Kavita Chauhan',
  'Rajendra Bhatt', 'Sunita Farswan', 'Naveen Kunwar', 'Meena Rautela', 'Ajay Thapliyal',
]
const AMENITIES_POOL = ['Wi-Fi', 'Hot Water', 'Bonfire', 'Home-cooked Meals', 'Parking', 'Mountain View', 'Guided Treks']

const escapeRegex = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// simple quote-aware CSV line parser (dataset has no embedded commas, but this is safe either way)
const parseCsvLine = line => {
  const values = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

const loadCsv = () => {
  const raw = fs.readFileSync(CSV_PATH, 'utf-8').split('\n').filter(Boolean)
  const headers = parseCsvLine(raw[0]).map(h => h.trim())
  return raw.slice(1).map(line => {
    const values = parseCsvLine(line)
    const row = {}
    headers.forEach((header, index) => { row[header] = (values[index] || '').trim() })
    return row
  })
}

const mostFrequent = arr => {
  const counts = {}
  arr.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

const buildHomestayDocs = rows => {
  const byName = {}
  rows.forEach(row => {
    if (!byName[row.homestay_name]) byName[row.homestay_name] = []
    byName[row.homestay_name].push(row)
  })

  return Object.entries(byName).map(([name, homestayRows], index) => {
    const district = mostFrequent(homestayRows.map(r => r.district))
    const village = VILLAGE_BY_DISTRICT[district] || district
    const geo = GEO_BY_DISTRICT[district] || { lat: 30.0, lng: 79.0 }
    const ratings = homestayRows.map(r => Number(r.rating))
    const avgRating = ratings.reduce((s, r) => s + r, 0) / ratings.length
    const propertyType = PROPERTY_TYPES[index % PROPERTY_TYPES.length]
    const category = CATEGORIES[index % CATEGORIES.length]
    const ownerName = OWNER_NAMES[index % OWNER_NAMES.length]
    const pricePerNight = Math.round((1200 + avgRating * 300 + (index % 5) * 100) / 50) * 50

    return {
      name,
      village,
      district,
      state: 'Uttarakhand',
      pricePerNight,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: homestayRows.length,
      propertyType,
      category,
      amenities: AMENITIES_POOL.slice(0, 4 + (index % 3)),
      maxGuests: 2 + (index % 4),
      description: `A ${propertyType.toLowerCase()} in ${village}, ${district}, offering an authentic Uttarakhand stay with warm local hospitality.`,
      imageUrls: [],
      ownerName,
      ownerContact: `+91-90000${String(10000 + index).slice(-5)}`,
      geo,
      available: true,
      _reviewRows: homestayRows, // kept only in-memory, not persisted
    }
  })
}

const GUEST_FIRST = ['Aman', 'Priya', 'Rohan', 'Neha', 'Vikram', 'Ananya', 'Karan', 'Isha', 'Arjun', 'Sneha', 'Rahul', 'Pooja', 'Aditya', 'Divya', 'Sameer']
const GUEST_LAST = ['Sharma', 'Verma', 'Gupta', 'Nair', 'Reddy', 'Kapoor', 'Iyer', 'Malhotra', 'Chatterjee', 'Menon']

const guestNameFor = reviewId => {
  const n = Number(reviewId)
  return `${GUEST_FIRST[n % GUEST_FIRST.length]} ${GUEST_LAST[n % GUEST_LAST.length]}`
}

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required. Set it in server/.env first.')
  if (!fs.existsSync(CSV_PATH)) throw new Error(`CSV not found at ${CSV_PATH}. Copy Uttarakhand_HomeStay_Reviews.csv into server/data/ first.`)

  console.log('Connecting to MongoDB...')
  await mongoose.connect(process.env.MONGO_URI)

  console.log('Clearing existing Homestay and Review collections...')
  await Promise.all([Homestay.deleteMany({}), Review.deleteMany({})])

  console.log('Reading and parsing CSV...')
  const rows = loadCsv()
  console.log(`Parsed ${rows.length} review rows.`)

  const homestayDocs = buildHomestayDocs(rows)
  console.log(`Derived ${homestayDocs.length} unique homestays from homestay_name.`)

  let totalReviews = 0
  for (const doc of homestayDocs) {
    const { _reviewRows, ...homestayData } = doc
    const homestay = await Homestay.create(homestayData)

    const reviewDocs = _reviewRows.map(row => ({
      homestayId: homestay._id,
      guestName: guestNameFor(row.review_id),
      rating: Number(row.rating),
      comment: row.review_text,
      date: row.review_date,
    }))

    await Review.insertMany(reviewDocs)
    totalReviews += reviewDocs.length
    console.log(`  Inserted "${homestay.name}" — ${reviewDocs.length} reviews`)
  }

  console.log(`\nDone. Imported ${homestayDocs.length} homestays and ${totalReviews} reviews from the Kaggle dataset.`)
  await mongoose.disconnect()
}

run().catch(error => {
  console.error('Import failed:', error)
  process.exit(1)
})

const mongoose = require('mongoose')

const categories = ['Adventure', 'Wildlife', 'Char Dham', 'Nature Eco', 'Religious', 'Camping', 'Trekking', 'Heritage', 'Wellness', 'Village Life']

const homestaySchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true, trim: true },
  village: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, default: 'Uttarakhand' },
  pricePerNight: { type: Number, required: true, min: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  propertyType: { type: String, required: true, trim: true },
  category: { type: String, enum: categories, default: 'Nature Eco' },
  amenities: [{ type: String, trim: true }],
  maxGuests: { type: Number, default: 2, min: 1 },
  description: { type: String, default: '' },
  imageUrls: [{ type: String }],
  owner: { type: String, ref: 'User' },
  ownerName: { type: String, required: true, trim: true },
  ownerContact: { type: String, default: '' },
  geo: {
    lat: { type: Number },
    lng: { type: Number },
  },
  available: { type: Boolean, default: true },
}, { timestamps: true })

homestaySchema.index({ name: 'text', village: 'text', district: 'text', propertyType: 'text', description: 'text' })
homestaySchema.set('toJSON', { transform: (_doc, ret) => { ret._id = ret._id.toString(); delete ret.__v; return ret } })

module.exports = mongoose.model('Homestay', homestaySchema)

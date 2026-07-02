const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  homestayId: { type: String, required: true },
  homestay: { type: String, ref: 'Homestay' },
  guestName: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  dimensions: {
    cleanliness: { type: Number, min: 1, max: 5 },
    hospitality: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    food: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
  },
}, { timestamps: true })

reviewSchema.set('toJSON', { transform: (_doc, ret) => { ret._id = ret._id.toString(); delete ret.__v; return ret } })

module.exports = mongoose.model('Review', reviewSchema)

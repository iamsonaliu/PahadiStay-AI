const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  homestay: { type: String, ref: 'Homestay', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, default: 'Standard' },
  pricePerNight: { type: Number, required: true, min: 0 },
  maxGuests: { type: Number, default: 2, min: 1 },
  amenities: [{ type: String }],
  available: { type: Boolean, default: true },
}, { timestamps: true })

roomSchema.set('toJSON', { transform: (_doc, ret) => { ret._id = ret._id.toString(); delete ret.__v; return ret } })

module.exports = mongoose.model('Room', roomSchema)

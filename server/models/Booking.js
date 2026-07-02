const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  homestayId: { type: String, required: true },
  homestay: { type: String, ref: 'Homestay' },
  homestayName: { type: String, required: true },
  guestName: { type: String, required: true, trim: true },
  guestEmail: { type: String, required: true, lowercase: true, trim: true },
  guestPhone: { type: String, default: '' },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  nights: { type: Number, required: true, min: 1 },
  guests: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  specialRequests: { type: String, default: '' },
}, { timestamps: true })

bookingSchema.set('toJSON', { transform: (_doc, ret) => { ret._id = ret._id.toString(); ret.createdAt = ret.createdAt ? ret.createdAt.toISOString() : ret.createdAt; delete ret.updatedAt; delete ret.__v; return ret } })

module.exports = mongoose.model('Booking', bookingSchema)

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['traveller', 'owner', 'admin'], default: 'traveller' },
  phone: { type: String, trim: true, default: '' },
}, { timestamps: true })

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret._id = ret._id.toString()
    delete ret.__v
    delete ret.passwordHash
    return ret
  },
})

module.exports = mongoose.model('User', userSchema)

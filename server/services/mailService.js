const nodemailer = require('nodemailer')

const isConfigured = () => process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS

const getTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const sendBookingNotification = async booking => {
  const to = process.env.OWNER_NOTIFY_EMAIL || process.env.SMTP_USER
  const subject = `New PahadiStay booking enquiry: ${booking.homestayName}`
  const text = `Guest ${booking.guestName} (${booking.guestEmail}) requested ${booking.nights} night(s) at ${booking.homestayName} from ${booking.checkIn} to ${booking.checkOut}. Total: ₹${booking.totalAmount}.`
  if (!isConfigured()) {
    console.log(`[email:dry-run] To: ${to || 'owner'} | ${subject} | ${text}`)
    return { dryRun: true }
  }
  return getTransport().sendMail({ from: process.env.SMTP_USER, to, subject, text })
}

module.exports = { sendBookingNotification }

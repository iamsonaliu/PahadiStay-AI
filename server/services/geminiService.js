const { generate } = require('../config/gemini')
const tripPlannerPrompt = require('../prompts/tripPlannerPrompt')
const recommendationPrompt = require('../prompts/recommendationPrompt')
const reviewAnalysisPrompt = require('../prompts/reviewAnalysisPrompt')
const monthlySummaryPrompt = require('../prompts/monthlySummaryPrompt')

const keywordThemes = reviews => {
  const terms = ['food', 'view', 'views', 'wifi', 'host', 'trek', 'bird', 'clean', 'bonfire', 'location']
  const text = reviews.map(r => r.comment || '').join(' ').toLowerCase()
  return terms.filter(t => text.includes(t)).map(t => ({ keyword: t, count: (text.match(new RegExp(t, 'g')) || []).length }))
}

const fallbackTrip = input => {
  const days = Math.max(Number(input.days) || 3, 1)
  const destination = input.destination || (input.districts || []).join(', ') || 'Uttarakhand'
  const interests = input.interests?.length ? input.interests.join(', ') : 'nature walks, local cuisine, village life'
  const lines = [`# ${days}-Day PahadiStay Itinerary for ${destination}`, '', `**Style:** ${input.budget || 'mid-range'} budget • Interests: ${interests} • Month: ${input.travelMonth || 'flexible'}`, '']
  for (let day = 1; day <= days; day += 1) {
    lines.push(`## Day ${day}`)
    lines.push(`- Morning: Slow breakfast with mandua roti, chai, and a scenic village walk around ${destination}.`)
    lines.push(`- Afternoon: Choose an activity around ${interests}; keep buffer time for hill-road travel.`)
    lines.push('- Evening: Return to your homestay for a bonfire, local dinner, and stargazing if weather permits.', '')
  }
  lines.push('**Pahadi tips:** carry layers, reusable water bottle, cash for remote villages, and check road/weather updates before departure.')
  return lines.join('\n')
}

const fallbackRecommendations = (prefs, homestays) => {
  const budget = Number(prefs.budget || prefs.maxPrice || Infinity)
  const interests = (prefs.interests || []).map(i => String(i).toLowerCase())
  return homestays.map(h => {
    let score = 40 + (Number(h.averageRating || 0) * 8)
    if (budget !== Infinity && h.pricePerNight <= budget) score += 15
    if (prefs.district && h.district.toLowerCase() === String(prefs.district).toLowerCase()) score += 20
    if (prefs.guests && h.maxGuests >= Number(prefs.guests)) score += 10
    const haystack = `${h.category || ''} ${h.propertyType} ${h.description} ${h.amenities.join(' ')}`.toLowerCase()
    const matched = interests.filter(i => haystack.includes(i))
    score += matched.length * 8
    return {
      homestay: h,
      score: Math.min(Math.round(score), 100),
      reason: `${h.name} fits ${matched.length ? matched.join(', ') : 'mountain comfort'} with ₹${h.pricePerNight}/night, ${h.averageRating}★ rating, and capacity for ${h.maxGuests} guests.`,
    }
  }).sort((a, b) => b.score - a.score)
}

const fallbackReviewAnalysis = reviews => {
  const avg = reviews.length ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length : 0
  const sentiment = avg >= 4.5 ? 'very positive' : avg >= 3.5 ? 'positive' : avg >= 2.5 ? 'mixed' : 'needs attention'
  const themes = keywordThemes(reviews)
  return {
    sentiment,
    averageRating: Number(avg.toFixed(1)),
    reviewCount: reviews.length,
    themes: themes.length ? themes : [{ keyword: 'hospitality', count: reviews.length }],
    suggestedReply: `Thank you for sharing your PahadiStay experience. We are delighted you enjoyed the mountain hospitality and will keep improving comfort, food, and local guidance for future guests.`,
  }
}

const planTrip = async input => {
  try {
    return { itinerary: await generate(tripPlannerPrompt(input)), provider: 'gemini' }
  } catch (_error) {
    return { itinerary: fallbackTrip(input), provider: 'fallback' }
  }
}

const recommendHomestays = async (prefs, homestays) => {
  try {
    const text = await generate(recommendationPrompt(prefs, homestays))
    return { recommendations: fallbackRecommendations(prefs, homestays), aiNote: text, provider: 'gemini' }
  } catch (_error) {
    return { recommendations: fallbackRecommendations(prefs, homestays), provider: 'fallback' }
  }
}

const analyzeReviews = async reviews => {
  try {
    const text = await generate(reviewAnalysisPrompt(reviews))
    return { ...fallbackReviewAnalysis(reviews), aiAnalysis: text, provider: 'gemini' }
  } catch (_error) {
    return { ...fallbackReviewAnalysis(reviews), provider: 'fallback' }
  }
}

const monthlySummary = async data => {
  try {
    return { summary: await generate(monthlySummaryPrompt(data)), provider: 'gemini' }
  } catch (_error) {
    return { summary: `This month has ${data.totalBookings || 0} bookings, ${data.totalReviews || 0} reviews, and an average platform rating of ${data.avgRating || 0}★. Focus on fast booking follow-ups and highlighting high-rated stays.`, provider: 'fallback' }
  }
}

const chat = async ({ message }) => {
  const prompt = `You are PahadiStay AI, a friendly Uttarakhand homestay and travel assistant. Answer safely and practically. User: ${message}`
  try {
    return { reply: await generate(prompt), provider: 'gemini' }
  } catch (_error) {
    return { reply: `Namaste! For Uttarakhand travel, choose stays by district, season, and interests. If you like nature, try Chopta, Kanatal, Kausani, Pangot, or Chakrata. Tell me your dates, budget, guests, and interests, and I can suggest a practical plan.`, provider: 'fallback' }
  }
}

module.exports = { planTrip, recommendHomestays, analyzeReviews, monthlySummary, chat }

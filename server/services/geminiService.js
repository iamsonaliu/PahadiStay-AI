const { generate } = require('../config/gemini')
const tripPlannerPrompt = require('../prompts/tripPlannerPrompt')
const recommendationPrompt = require('../prompts/recommendationPrompt')
const reviewAnalysisPrompt = require('../prompts/reviewAnalysisPrompt')
const monthlySummaryPrompt = require('../prompts/monthlySummaryPrompt')

const parseJsonFromMarkdown = (text) => {
  if (!text) return null
  let cleaned = text.trim()
  
  // Extract content between ```json and ``` if present
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (match) {
      cleaned = match[1]
    }
  }
  cleaned = cleaned.trim()

  try {
    return JSON.parse(cleaned)
  } catch (firstError) {
    // Attempt to extract the JSON object/array substring in case of preambles
    const startObj = cleaned.indexOf('{')
    const startArr = cleaned.indexOf('[')
    let startIdx = -1
    let endIdx = -1
    
    if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
      startIdx = startObj
      endIdx = cleaned.lastIndexOf('}')
    } else if (startArr !== -1) {
      startIdx = startArr
      endIdx = cleaned.lastIndexOf(']')
    }
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        return JSON.parse(cleaned.substring(startIdx, endIdx + 1))
      } catch (secondError) {
        console.error('JSON parsing failed even after extracting block:', secondError)
      }
    }
    console.error('Failed to parse JSON from Gemini response:', firstError)
    return null
  }
}

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
  const fallback = fallbackRecommendations(prefs, homestays)
  try {
    const text = await generate(recommendationPrompt(prefs, homestays))
    const parsed = parseJsonFromMarkdown(text)
    if (Array.isArray(parsed) && parsed.length > 0) {
      const recommendations = parsed.map(item => {
        const h = homestays.find(home => String(home._id) === String(item.homestayId || item._id))
        if (!h) return null
        return {
          homestay: h,
          score: typeof item.score === 'number' ? item.score : 50,
          reason: item.reason || 'Matches your travel preferences.'
        }
      }).filter(Boolean)

      if (recommendations.length > 0) {
        recommendations.sort((a, b) => b.score - a.score)
        return { recommendations, aiNote: 'AI recommendation model complete.', provider: 'gemini' }
      }
    }
    return { recommendations: fallback, aiNote: 'AI could not rank homestays. Local ranking applied.', provider: 'gemini' }
  } catch (_error) {
    console.error('Gemini recommendHomestays failed:', _error)
    return { recommendations: fallback, provider: 'fallback' }
  }
}

const analyzeReviews = async reviews => {
  const fallback = fallbackReviewAnalysis(reviews)
  try {
    const text = await generate(reviewAnalysisPrompt(reviews))
    const parsed = parseJsonFromMarkdown(text)
    if (parsed) {
      let themes = parsed.themes || parsed.topThemes || parsed.keywords || fallback.themes
      if (Array.isArray(themes)) {
        themes = themes.map(t => {
          if (typeof t === 'string') return { theme: t, label: t }
          return { theme: t.theme || t.label || t.keyword || 'Insight', count: t.count || 1 }
        })
      }
      return {
        sentiment: parsed.sentiment || parsed.overallSentiment || fallback.sentiment,
        averageRating: fallback.averageRating,
        reviewCount: fallback.reviewCount,
        themes: themes,
        suggestedReply: parsed.suggestedReply || parsed.reply || fallback.suggestedReply,
        risks: parsed.risks || [],
        opportunities: parsed.opportunities || [],
        aiAnalysis: text,
        provider: 'gemini'
      }
    }
    return { ...fallback, aiAnalysis: text, provider: 'gemini' }
  } catch (_error) {
    console.error('Gemini analyzeReviews failed:', _error)
    return { ...fallback, provider: 'fallback' }
  }
}

const monthlySummary = async data => {
  try {
    return { summary: await generate(monthlySummaryPrompt(data)), provider: 'gemini' }
  } catch (_error) {
    return { summary: `This month has ${data.totalBookings || 0} bookings, ${data.totalReviews || 0} reviews, and an average platform rating of ${data.avgRating || 0}★. Focus on fast booking follow-ups and highlighting high-rated stays.`, provider: 'fallback' }
  }
}

const chat = async ({ message, history = [] }) => {
  try {
    const contents = []
    
    if (Array.isArray(history)) {
      history.forEach(h => {
        if (h.role && h.content) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          })
        }
      })
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })
    
    const reply = await generate(contents, {
      config: {
        temperature: 0.7,
        systemInstruction: "You are PahadiStay AI, a friendly, welcoming, and knowledgeable Uttarakhand travel guide and homestay assistant. Help travellers find verified homestays, plan day-by-day itineraries, suggest local food (like Mandua roti, Gahat dal, Bhang ki chutney), highlight safety on remote roads, and answer questions. Answer safely, warmly, and practically. Use friendly formatting with bullets or markdown when appropriate."
      }
    })
    
    return { reply, provider: 'gemini' }
  } catch (_error) {
    console.error('Gemini chat failed:', _error)
    return { reply: `Namaste! For Uttarakhand travel, choose stays by district, season, and interests. If you like nature, try Chopta, Kanatal, Kausani, Pangot, or Chakrata. Tell me your dates, budget, guests, and interests, and I can suggest a practical plan.`, provider: 'fallback' }
  }
}

module.exports = { planTrip, recommendHomestays, analyzeReviews, monthlySummary, chat }

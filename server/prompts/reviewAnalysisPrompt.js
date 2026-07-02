module.exports = reviews => `Analyze these homestay reviews for owner insights: ${JSON.stringify(reviews)}.
Return JSON with sentiment, themes array, risks, opportunities, and a warm suggested owner reply.`

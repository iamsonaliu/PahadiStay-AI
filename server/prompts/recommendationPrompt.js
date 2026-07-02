module.exports = (prefs, homestays) => `Rank these Uttarakhand homestays for the traveller preferences. Preferences: ${JSON.stringify(prefs)}.
Homestays: ${JSON.stringify(homestays)}.
Return JSON array with homestay _id, score 0-100, and reason.`

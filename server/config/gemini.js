const { GoogleGenAI } = require('@google/genai')

class MissingGeminiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not configured')
    this.code = 'GEMINI_KEY_MISSING'
  }
}

let client
const getClient = () => {
  if (!process.env.GEMINI_API_KEY) throw new MissingGeminiKeyError()
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  return client
}

const generate = async (prompt, opts = {}) => {
  const ai = getClient()
  const response = await ai.models.generateContent({
    model: opts.model || 'gemini-2.0-flash',
    contents: prompt,
    config: opts.config || { temperature: 0.7 },
  })
  return response.text || ''
}

module.exports = { generate, MissingGeminiKeyError }

/**
 * Central API client for PahadiStay AI.
 * - Injects JWT bearer token when present.
 * - Exposes typed service objects matching the Express backend.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let authToken = localStorage.getItem('ps-token') || null
export function setAuthToken(token) { authToken = token }

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({ success: false, message: 'No response body' }))
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
  return data
}

const qs = (params = {}) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ''
}

// ─── Homestays ──────────────────────────────────────────────
export const homestayService = {
  getAll:     (params = {}) => request(`/homestays${qs(params)}`),
  search:     (q)           => request(`/homestays/search?q=${encodeURIComponent(q)}`),
  getById:    (id)          => request(`/homestays/${id}`),
  create:     (body)        => request('/homestays',        { method: 'POST', body: JSON.stringify(body) }),
  update:     (id, body)    => request(`/homestays/${id}`,  { method: 'PUT',  body: JSON.stringify(body) }),
  delete:     (id)          => request(`/homestays/${id}`,  { method: 'DELETE' }),
  getReviews: (id)          => request(`/homestays/${id}/reviews`),
  addReview:  (id, body)    => request(`/homestays/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
}

// ─── Bookings ───────────────────────────────────────────────
export const bookingService = {
  getAll: ()     => request('/bookings'),
  create: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
}

// ─── Stats / Dashboard ──────────────────────────────────────
export const statsService = {
  get: () => request('/stats'),
}
export const dashboardService = {
  overview: () => request('/dashboard/overview'),
}

// ─── Auth ───────────────────────────────────────────────────
export const authService = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),
}

// ─── AI: planner / chat / recommend / review analysis ───────
export const aiService = {
  planTrip:      (body) => request('/planner', { method: 'POST', body: JSON.stringify(body) }),
  chat:          (body) => request('/chat',    { method: 'POST', body: JSON.stringify(body) }),
  recommend:     (body) => request('/ai/recommend',       { method: 'POST', body: JSON.stringify(body) }),
  analyzeReviews:(body) => request('/ai/analyze-reviews', { method: 'POST', body: JSON.stringify(body) }),
}

// ─── Weather (Open-Meteo, no key required) ──────────────────
export const weatherService = {
  async forecast(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&forecast_days=5`
    const res = await fetch(url)
    if (!res.ok) throw new Error('weather unavailable')
    return res.json()
  },
}
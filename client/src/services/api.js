const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({ success: false, message: 'No response body' }))
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
  return data
}

// Homestays
export const homestayService = {
  getAll:    (params = {}) => request(`/homestays?${new URLSearchParams(params)}`),
  search:    (q)           => request(`/homestays/search?q=${encodeURIComponent(q)}`),
  getById:   (id)          => request(`/homestays/${id}`),
  create:    (body)        => request('/homestays',     { method: 'POST', body: JSON.stringify(body) }),
  update:    (id, body)    => request(`/homestays/${id}`, { method: 'PUT',  body: JSON.stringify(body) }),
  delete:    (id)          => request(`/homestays/${id}`, { method: 'DELETE' }),
  getReviews:(id)          => request(`/homestays/${id}/reviews`),
  addReview: (id, body)    => request(`/homestays/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
}

// Bookings
export const bookingService = {
  getAll:    ()     => request('/bookings'),
  create:    (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
}

// Stats
export const statsService = {
  get: () => request('/stats'),
}
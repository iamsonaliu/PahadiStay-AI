import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FaStar } from 'react-icons/fa6'
import { aiService, homestayService } from '../../services/api'

const sentimentClass = (sentiment = 'neutral') => ({
  positive: 'bg-forest-50 text-forest-700 dark:bg-forest-400/15 dark:text-forest-100',
  neutral: 'bg-sky-400/15 text-sky-600 dark:text-sky-400',
  negative: 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200',
}[sentiment.toLowerCase()] || 'bg-cream-200 text-gray-600 dark:bg-white/10 dark:text-cream-100')

const normalizeReviews = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.reviews)) return payload.data.reviews
  if (Array.isArray(payload?.reviews)) return payload.reviews
  return []
}

export default function Reviews() {
  const [homestays, setHomestays] = useState([])
  const [reviews, setReviews] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const homeRes = await homestayService.getAll()
        const homes = Array.isArray(homeRes?.data) ? homeRes.data : []
        const first = homes[0]
        let collected = []
        let ai = null

        if (first?._id) {
          try {
            const [detailRes, reviewRes, aiRes] = await Promise.allSettled([
              homestayService.getById(first._id),
              homestayService.getReviews(first._id),
              aiService.analyzeReviews({ homestayId: first._id }),
            ])
            const detailReviews = detailRes.status === 'fulfilled' ? normalizeReviews(detailRes.value?.data ?? detailRes.value) : []
            const endpointReviews = reviewRes.status === 'fulfilled' ? normalizeReviews(reviewRes.value) : []
            collected = [...detailReviews, ...endpointReviews]
            ai = aiRes.status === 'fulfilled' ? (aiRes.value?.data ?? aiRes.value) : null
          } catch {
            collected = []
          }
        }

        if (active) {
          setHomestays(homes)
          setReviews(collected)
          setAnalysis(ai)
        }
      } catch (error) {
        toast.error(error.message || 'Could not load review insights')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const themes = useMemo(() => {
    const raw = analysis?.themes ?? analysis?.topThemes ?? analysis?.keywords ?? []
    return Array.isArray(raw) ? raw.map((item) => typeof item === 'string' ? item : item?.theme ?? item?.label).filter(Boolean) : []
  }, [analysis])
  const sentiment = analysis?.overallSentiment ?? analysis?.sentiment ?? 'neutral'
  const suggestedReply = analysis?.suggestedReply ?? analysis?.reply ?? 'Thank you for staying with us. We are grateful for your feedback and hope to host you again in the mountains soon.'

  if (loading) return <div className="card p-8 text-center text-gray-500 dark:text-cream-100/70">Reading guest reviews…</div>

  if (!homestays.length) {
    return (
      <div className="card p-10 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-forest-50 text-gold-500 dark:bg-white/10">
          <FaStar className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No homestays found</h2>
        <p className="text-gray-500 dark:text-cream-100/70">Review analysis will unlock after you list a homestay.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="card p-6 md:p-8 bg-gradient-to-br from-white to-cream-100 dark:from-forest-800 dark:to-forest-900">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
          <div>
            <p className="eyebrow mb-1">AI Review Analysis</p>
            <h2 className="text-2xl font-bold">Guest sentiment snapshot</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-cream-100/60">Based on {homestays[0]?.name ?? homestays[0]?.title ?? 'your first homestay'}.</p>
          </div>
          <span className={`pill capitalize ${sentimentClass(sentiment)}`}>{sentiment}</span>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
          <div className="rounded-2xl bg-cream-50 dark:bg-white/5 p-5">
            <h3 className="font-semibold mb-3">Recurring themes</h3>
            <div className="flex flex-wrap gap-2">
              {(themes.length ? themes : ['Warm hosts', 'Mountain views', 'Local food']).map((theme) => <span key={theme} className="pill bg-forest-50 text-forest-700 dark:bg-white/10 dark:text-cream-50">{theme}</span>)}
            </div>
          </div>
          <div className="rounded-2xl bg-forest-900 text-cream-50 p-5">
            <h3 className="text-cream-50 font-semibold mb-3">Suggested host reply</h3>
            <p className="text-cream-100/80 leading-relaxed">{suggestedReply}</p>
          </div>
        </div>
      </section>

      <section className="card p-6 md:p-8">
        <div className="mb-5"><p className="eyebrow mb-1">Recent feedback</p><h2 className="text-2xl font-bold">Reviews</h2></div>
        {reviews.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.slice(0, 6).map((review, index) => (
              <article key={review?._id ?? index} className="rounded-2xl border border-cream-200 dark:border-white/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-forest-800 dark:text-cream-50">{review?.guestName ?? review?.userName ?? 'Guest'}</h3>
                  <span className="flex items-center gap-0.5 text-gold-500">
                    {Array.from({ length: Math.max(1, Math.round(review?.rating ?? 5)) }).map((_, starIndex) => (
                      <FaStar key={starIndex} className="h-3.5 w-3.5" />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-cream-100/75 leading-relaxed">{review?.comment ?? review?.text ?? review?.message ?? 'A peaceful stay with warm hospitality.'}</p>
              </article>
            ))}
          </div>
        ) : <div className="rounded-2xl bg-cream-100 dark:bg-forest-900/60 p-8 text-center text-gray-500 dark:text-cream-100/70">No written reviews yet. The AI card is ready when guests start sharing feedback.</div>}
      </section>
    </div>
  )
}

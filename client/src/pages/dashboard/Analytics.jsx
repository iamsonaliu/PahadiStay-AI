import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dashboardService, homestayService } from '../../services/api'

const COLORS = ['#00684a', '#e0891e', '#00aeef', '#f4b400', '#33a87b', '#c2740f']

const groupBy = (items, keyPicker, fallback) => {
  const groups = items.reduce((acc, item) => {
    const key = keyPicker(item) || fallback
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  return Object.entries(groups).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

function ChartCard({ title, eyebrow, children }) {
  return (
    <section className="card p-6">
      <p className="eyebrow mb-1">{eyebrow}</p>
      <h2 className="text-2xl font-bold mb-5">{title}</h2>
      {children}
    </section>
  )
}

export default function Analytics() {
  const [homestays, setHomestays] = useState([])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const [homeRes, overviewRes] = await Promise.allSettled([homestayService.getAll(), dashboardService.overview()])
        if (active) {
          setHomestays(homeRes.status === 'fulfilled' && Array.isArray(homeRes.value?.data) ? homeRes.value.data : [])
          setOverview(overviewRes.status === 'fulfilled' ? (overviewRes.value?.data ?? overviewRes.value) : null)
        }
      } catch (error) {
        toast.error(error.message || 'Could not load analytics')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const districtData = useMemo(() => groupBy(homestays, (h) => h?.district, 'Unknown district'), [homestays])
  const categoryData = useMemo(() => groupBy(homestays, (h) => h?.category ?? h?.propertyType, 'Homestay'), [homestays])
  const trendData = useMemo(() => {
    const raw = overview?.monthlyTrend ?? overview?.trend ?? []
    return Array.isArray(raw) ? raw.map((item, index) => ({ month: item?.month ?? item?.label ?? `M${index + 1}`, bookings: Number(item?.bookings ?? item?.count ?? item?.totalBookings ?? 0) })) : []
  }, [overview])

  if (loading) return <div className="card p-8 text-center text-gray-500 dark:text-cream-100/70">Preparing charts…</div>

  return (
    <div className="space-y-6">
      <div className="card p-6 md:p-8 bg-forest-gradient text-white">
        <p className="text-terra-400 text-xs font-semibold uppercase tracking-[0.18em] mb-2">AI summary</p>
        <h2 className="text-2xl font-bold text-white mb-3">Demand is strongest where inventory clusters.</h2>
        <p className="text-cream-100/80 leading-relaxed max-w-3xl">
          Use district and category charts to spot listing gaps, then tune pricing, photos, and review replies for the traveller segments you want to attract.
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <ChartCard eyebrow="Geography" title="Homestays by district">
          {districtData.length ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#efece1" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00684a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-[280px] grid place-items-center rounded-2xl bg-cream-100 dark:bg-forest-900/60 text-gray-500 dark:text-cream-100/70">No homestay district data yet.</div>}
        </ChartCard>

        <ChartCard eyebrow="Inventory mix" title="Category distribution">
          {categoryData.length ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={4}>
                    {categoryData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="h-[280px] grid place-items-center rounded-2xl bg-cream-100 dark:bg-forest-900/60 text-gray-500 dark:text-cream-100/70">No category data yet.</div>}
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryData.map((item, index) => <span key={item.name} className="pill bg-cream-100 text-gray-700 dark:bg-white/10 dark:text-cream-50"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />{item.name}: {item.value}</span>)}
          </div>
        </ChartCard>
      </div>

      <ChartCard eyebrow="Bookings" title="Monthly booking trend">
        {trendData.length ? (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#efece1" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#00aeef" strokeWidth={3} dot={{ fill: '#e0891e', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <div className="h-[280px] grid place-items-center rounded-2xl bg-cream-100 dark:bg-forest-900/60 text-gray-500 dark:text-cream-100/70 text-center px-6">Booking trend data will appear once dashboard analytics are available.</div>}
      </ChartCard>
    </div>
  )
}

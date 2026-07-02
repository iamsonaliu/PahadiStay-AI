import { useEffect, useState } from 'react'
import {
  WiDaySunny, WiDayCloudy, WiCloud, WiCloudy, WiFog,
  WiShowers, WiRain, WiSnow, WiThunderstorm, WiThermometer,
} from 'react-icons/wi'
import { weatherService } from '../../services/api'

// WMO weather code → [icon component, label]
const WMO = {
  0: [WiDaySunny, 'Clear'], 1: [WiDaySunny, 'Mainly clear'], 2: [WiDayCloudy, 'Partly cloudy'], 3: [WiCloudy, 'Overcast'],
  45: [WiFog, 'Fog'], 48: [WiFog, 'Rime fog'], 51: [WiShowers, 'Light drizzle'], 53: [WiShowers, 'Drizzle'],
  55: [WiShowers, 'Dense drizzle'], 61: [WiRain, 'Light rain'], 63: [WiRain, 'Rain'], 65: [WiRain, 'Heavy rain'],
  71: [WiSnow, 'Light snow'], 73: [WiSnow, 'Snow'], 75: [WiSnow, 'Heavy snow'], 80: [WiShowers, 'Showers'],
  81: [WiShowers, 'Showers'], 82: [WiRain, 'Heavy showers'], 85: [WiSnow, 'Snow showers'], 95: [WiThunderstorm, 'Thunderstorm'],
}
const codeOf = (c) => WMO[c] || [WiCloud, '—']
const dayName = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short' })

export default function WeatherCard({ lat, lng }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    if (lat == null || lng == null) return
    weatherService.forecast(lat, lng).then(setData).catch(() => setErr(true))
  }, [lat, lng])

  if (err) return null
  if (!data) return <div className="card p-5 h-32 animate-pulse" />

  const [CurIcon, cLabel] = codeOf(data.current?.weather_code)

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-forest-800 dark:text-cream-50">Weather forecast</h3>
        <span className="text-xs text-gray-400">via Open-Meteo</span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <CurIcon className="w-14 h-14 text-sky-500 shrink-0" />
        <div>
          <div className="flex items-center text-3xl font-bold text-forest-700 dark:text-cream-50">
            {Math.round(data.current?.temperature_2m)}
            <WiThermometer className="w-6 h-6 -ml-1 text-terra-500" />
          </div>
          <div className="text-sm text-gray-500">{cLabel}</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 text-center">
        {data.daily?.time?.slice(0, 5).map((t, i) => {
          const [DIcon] = codeOf(data.daily.weather_code[i])
          return (
            <div key={t} className="rounded-xl bg-cream-100 dark:bg-forest-800 py-2">
              <div className="text-xs text-gray-400">{dayName(t)}</div>
              <DIcon className="w-7 h-7 mx-auto text-sky-500" />
              <div className="text-xs font-medium">{Math.round(data.daily.temperature_2m_max[i])}°</div>
              <div className="text-[10px] text-gray-400">{Math.round(data.daily.temperature_2m_min[i])}°</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

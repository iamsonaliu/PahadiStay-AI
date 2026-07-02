import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoMercator, geoPath, geoCentroid } from 'd3-geo'
import ukGeo from '../../data/uk-districts.geojson?url'

const WIDTH = 760
const HEIGHT = 560

// category → marker colour (mirrors the UTDB legend)
const CATEGORY_COLORS = {
  Adventure: '#e0891e',
  Wildlife:  '#8a6d3b',
  'Char Dham': '#00aeef',
  'Nature Eco': '#0d8a5f',
  Religious: '#d6336c',
  Camping:   '#075640',
  Trekking:  '#9a5a0d',
  default:   '#00684a',
}

/**
 * Interactive SVG map of Uttarakhand's 13 districts.
 * - Hover a district → it highlights + a tooltip shows its name.
 * - Click a district → browse homestays in that district.
 * - Category pins are projected from each homestay's district centroid.
 */
export default function UttarakhandMap({ homestays = [], activeCategory = 'All' }) {
  const navigate = useNavigate()
  const [geo, setGeo] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, text: '' })

  useEffect(() => {
    fetch(ukGeo).then((r) => r.json()).then(setGeo).catch(() => {})
  }, [])

  const { paths, centroids } = useMemo(() => {
    if (!geo) return { paths: [], centroids: {} }
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], geo)
    const pathGen = geoPath(projection)
    const paths = geo.features.map((f) => ({
      d: pathGen(f),
      name: f.properties.district,
    }))
    const centroids = {}
    geo.features.forEach((f) => {
      const name = f.properties.district?.toLowerCase()
      centroids[name] = projection(geoCentroid(f))
    })
    return { paths, centroids }
  }, [geo])

  // markers: one pin per homestay, placed at its district centroid (jittered)
  const markers = useMemo(() => {
    return homestays
      .filter((h) => activeCategory === 'All' || h.category === activeCategory)
      .map((h, i) => {
        const c = centroids[(h.district || '').toLowerCase()]
        if (!c) return null
        const angle = (i * 47) % 360
        const r = 8 + ((i * 13) % 14)
        return {
          id: h._id,
          x: c[0] + Math.cos(angle) * r,
          y: c[1] + Math.sin(angle) * r,
          color: CATEGORY_COLORS[h.category] || CATEGORY_COLORS.default,
          name: h.name,
        }
      })
      .filter(Boolean)
  }, [homestays, centroids, activeCategory])

  if (!geo) {
    return (
      <div className="aspect-[4/3] grid place-items-center text-forest-600/60 animate-pulse">
        Loading Uttarakhand map…
      </div>
    )
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto drop-shadow-sm"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="dist" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0d8a5f" />
            <stop offset="1" stopColor="#00684a" />
          </linearGradient>
        </defs>

        {paths.map((p) => {
          const isHovered = hovered === p.name
          return (
            <path
              key={p.name}
              d={p.d}
              fill={isHovered ? '#e0891e' : 'url(#dist)'}
              stroke="#ffffff"
              strokeWidth={isHovered ? 1.8 : 0.9}
              className="cursor-pointer transition-[fill] duration-150"
              style={{ filter: isHovered ? 'drop-shadow(0 4px 10px rgba(224,137,30,0.45))' : 'none' }}
              onMouseEnter={() => setHovered(p.name)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect()
                setTooltip({
                  x: ((e.clientX - rect.left) / rect.width) * WIDTH,
                  y: ((e.clientY - rect.top) / rect.height) * HEIGHT,
                  text: p.name,
                })
              }}
              onClick={() => navigate(`/homestays?district=${encodeURIComponent(p.name)}`)}
            />
          )
        })}

        {/* category markers */}
        {markers.map((m) => (
          <g key={m.id} className="cursor-pointer" onClick={() => navigate(`/homestays/${m.id}`)}>
            <circle cx={m.x} cy={m.y} r={5.5} fill={m.color} stroke="#fff" strokeWidth={1.5} />
            <circle cx={m.x} cy={m.y} r={5.5} fill={m.color} opacity={0.35}>
              <animate attributeName="r" values="5.5;11;5.5" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* tooltip */}
        {hovered && (
          <g transform={`translate(${tooltip.x + 12}, ${tooltip.y - 10})`} pointerEvents="none">
            <rect width={Math.max(70, tooltip.text.length * 8.5)} height={26} rx={6} fill="#072a20" />
            <text x={10} y={17} fill="#fff" fontSize={13} fontWeight={600}>{tooltip.text}</text>
          </g>
        )}
      </svg>
    </div>
  )
}

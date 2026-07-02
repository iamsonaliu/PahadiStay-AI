import { useNavigate } from 'react-router-dom'
import {
  FaPersonHiking, FaPaw, FaPlaceOfWorship, FaTree,
  FaOm, FaCampground, FaShoePrints, FaDove,
} from 'react-icons/fa6'

export const CATEGORIES = [
  { key: 'Adventure',     Icon: FaPersonHiking,   color: 'bg-terra-500' },
  { key: 'Wildlife',      Icon: FaPaw,            color: 'bg-[#8a6d3b]' },
  { key: 'Char Dham',     Icon: FaPlaceOfWorship, color: 'bg-sky-500' },
  { key: 'Nature Eco',    Icon: FaTree,           color: 'bg-forest-500' },
  { key: 'Religious',     Icon: FaOm,             color: 'bg-[#d6336c]' },
  { key: 'Camping',       Icon: FaCampground,     color: 'bg-forest-700' },
  { key: 'Trekking',      Icon: FaShoePrints,     color: 'bg-[#9a5a0d]' },
  { key: 'Bird Watching', Icon: FaDove,           color: 'bg-forest-600' },
]

export default function CategoryStrip() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {CATEGORIES.map(({ key, Icon, color }, i) => (
        <button
          key={key}
          onClick={() => navigate(`/homestays?category=${encodeURIComponent(key)}`)}
          className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white hover:shadow-soft transition-all animate-fade-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <span className={`w-14 h-14 grid place-items-center rounded-2xl text-white ${color} shadow-soft group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </span>
          <span className="text-xs font-medium text-forest-800 dark:text-cream-100 text-center leading-tight">
            {key}
          </span>
        </button>
      ))}
    </div>
  )
}

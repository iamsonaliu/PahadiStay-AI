import { useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

/**
 * Horizontal scroll-snap carousel with prev/next controls.
 * Pass an array of React nodes as children; each becomes a snapped slide.
 */
export default function Carousel({ children, slideClass = 'w-72 sm:w-80' }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Previous"
        className="hidden md:grid absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 place-items-center rounded-full bg-white shadow-card text-forest-700 hover:bg-forest-600 hover:text-white transition-colors"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-1 px-1
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.isArray(children) ? children.map((child, i) => (
          <div key={i} className={`snap-start shrink-0 ${slideClass}`}>{child}</div>
        )) : children}
      </div>

      <button
        onClick={() => scrollBy(1)}
        aria-label="Next"
        className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 place-items-center rounded-full bg-white shadow-card text-forest-700 hover:bg-forest-600 hover:text-white transition-colors"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

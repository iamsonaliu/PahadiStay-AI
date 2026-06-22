/**
 * Loader
 * Two exported components:
 *
 * <Loader />
 * @param {string}  size      - 'sm' | 'md' | 'lg' | 'xl' (default 'md')
 * @param {string}  color     - any Tailwind text-* color class (default 'text-terra-500')
 * @param {string}  label     - accessible aria-label (default 'Loading…')
 * @param {boolean} overlay   - if true, centres over parent with semi-transparent backdrop
 *
 * <Skeleton />
 * @param {string}  className - shape/size via Tailwind classes (e.g. 'h-4 w-32 rounded')
 * @param {number}  lines     - convenience: renders N stacked lines (overrides className)
 * @param {string}  variant   - 'card' renders a pre-built card skeleton layout
 */

// ──────────────────────────────────────────────────────────
// Spinner Loader
// ──────────────────────────────────────────────────────────
const spinSize = {
  sm:  'w-4 h-4  border-2',
  md:  'w-7 h-7  border-[3px]',
  lg:  'w-10 h-10 border-4',
  xl:  'w-14 h-14 border-4',
}

export function Loader({
  size = 'md',
  color = 'border-terra-500',
  label = 'Loading…',
  overlay = false,
}) {
  const spinner = (
    <div role="status" aria-label={label} className="flex flex-col items-center gap-2">
      <div
        className={[
          'rounded-full border-gray-200 border-t-terra-500 animate-spin',
          spinSize[size] ?? spinSize.md,
          color,
        ].join(' ')}
      />
      <span className="sr-only">{label}</span>
    </div>
  )

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-20 rounded-inherit">
        {spinner}
      </div>
    )
  }

  return spinner
}

// ──────────────────────────────────────────────────────────
// Skeleton
// ──────────────────────────────────────────────────────────
const shimmer = 'animate-pulse bg-gray-200 dark:bg-gray-700'

function SkeletonBlock({ className = '' }) {
  return <div className={`${shimmer} ${className}`} aria-hidden="true" />
}

export function Skeleton({ className, lines, variant }) {
  // Card skeleton layout
  if (variant === 'card') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <SkeletonBlock className="h-48 w-full" />
        <div className="p-4 space-y-2.5">
          <SkeletonBlock className="h-4 w-3/4 rounded" />
          <SkeletonBlock className="h-3 w-1/2 rounded" />
          <div className="flex justify-between pt-1">
            <SkeletonBlock className="h-5 w-20 rounded" />
            <SkeletonBlock className="h-3 w-16 rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Multi-line text skeleton
  if (lines) {
    return (
      <div className="space-y-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={`h-3 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    )
  }

  // Generic block (caller controls shape)
  return <SkeletonBlock className={className} />
}

// Default export = the spinner for simple usage
export default Loader
/**
 * Button
 * @param {string}   variant   - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string}   size      - 'sm' | 'md' | 'lg'
 * @param {boolean}  disabled  - disables interaction
 * @param {boolean}  loading   - shows spinner, disables interaction
 * @param {string}   type      - button type attribute (default 'button')
 * @param {function} onClick   - click handler
 * @param {node}     children  - button label/content
 * @param {string}   className - extra Tailwind classes
 */

const variantClasses = {
  primary:   'bg-terra-500 text-white hover:bg-terra-600 focus-visible:ring-terra-500',
  secondary: 'bg-forest-900 text-white hover:bg-forest-800 focus-visible:ring-forest-700 dark:bg-forest-700 dark:hover:bg-forest-600',
  outline:   'border-2 border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-white focus-visible:ring-forest-700 dark:border-cream-200 dark:text-cream-200 dark:hover:bg-cream-200 dark:hover:text-forest-900',
  ghost:     'text-forest-900 hover:bg-forest-900/10 focus-visible:ring-forest-700 dark:text-cream-200 dark:hover:bg-cream-200/10',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

const sizeClasses = {
  sm:  'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md:  'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg:  'px-7 py-3 text-base rounded-lg gap-2.5',
}

function Spinner({ size }) {
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <svg className={`${spinnerSize} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  className = '',
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading && <Spinner size={size} />}
      {children}
    </button>
  )
}
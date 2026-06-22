/**
 * Input
 * @param {string}   label       - visible label above the field
 * @param {string}   id          - id attr; auto-derived from label if omitted
 * @param {string}   type        - input type (default 'text')
 * @param {string}   placeholder - placeholder text
 * @param {string}   value       - controlled value
 * @param {function} onChange    - change handler (e) => void
 * @param {string}   error       - error message; turns border red
 * @param {string}   helper      - helper text shown below the field
 * @param {boolean}  disabled    - disables the field
 * @param {boolean}  required    - shows asterisk next to label
 * @param {node}     leftIcon    - icon rendered inside the left side
 * @param {node}     rightIcon   - icon rendered inside the right side
 * @param {string}   className   - extra classes on the wrapper div
 */

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helper,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  className = '',
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'input'

  const baseInput = [
    'w-full rounded-lg border bg-white text-sm text-gray-800 placeholder-gray-400',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'dark:bg-gray-800 dark:text-cream-100 dark:placeholder-gray-500',
    leftIcon  ? 'pl-10' : 'pl-3.5',
    rightIcon ? 'pr-10' : 'pr-3.5',
    'py-2.5',
    error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-300'
      : 'border-gray-200 focus:border-forest-700 focus:ring-forest-200 dark:border-gray-600 dark:focus:border-terra-500',
    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' : '',
  ].join(' ')

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-cream-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          className={baseInput}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {helper && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-gray-400 dark:text-gray-500">
          {helper}
        </p>
      )}
    </div>
  )
}
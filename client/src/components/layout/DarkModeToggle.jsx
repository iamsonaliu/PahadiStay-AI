/**
 * DarkModeToggle
 * Accessible sun/moon toggle button.
 * Uses ThemeContext — wrap app in <ThemeProvider> before using.
 *
 * @param {string} className - extra classes for positioning
 */

import { useTheme } from '../../context/ThemeContext'

export default function DarkModeToggle({ className = '' }) {
  const { dark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={[
        'relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200',
        'text-cream-200 hover:text-white hover:bg-forest-800',
        'dark:text-cream-200 dark:hover:bg-gray-700',
        className,
      ].join(' ')}
    >
      {dark ? (
        // Sun icon
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        // Moon icon
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
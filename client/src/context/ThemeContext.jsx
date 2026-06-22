/**
 * ThemeContext
 * Provides dark/light mode state and a toggle function.
 *
 * Wrap your app:
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 *
 * Consume anywhere:
 *   const { dark, toggleTheme } = useTheme()
 *
 * Tailwind requires `darkMode: 'class'` in tailwind.config.js (already set).
 */

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ dark: false, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('pahadistay-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pahadistay-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
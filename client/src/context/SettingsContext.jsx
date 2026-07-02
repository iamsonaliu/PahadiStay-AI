import { createContext, useContext, useEffect, useState } from 'react'

/**
 * SettingsContext — accessibility & i18n-lite settings that mirror the
 * Uttarakhand Tourism header controls: font-size (A+ / A / A-) and language.
 */
const STEPS = [0.875, 1, 1.125, 1.25] // A-, A, A+, A++
const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [fontStep, setFontStep] = useState(() => {
    const s = Number(localStorage.getItem('ps-font-step'))
    return Number.isFinite(s) && s >= 0 && s < STEPS.length ? s : 1
  })
  const [lang, setLang] = useState(() => localStorage.getItem('ps-lang') || 'en')

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', STEPS[fontStep])
    localStorage.setItem('ps-font-step', String(fontStep))
  }, [fontStep])

  useEffect(() => {
    localStorage.setItem('ps-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const incFont = () => setFontStep((s) => Math.min(STEPS.length - 1, s + 1))
  const decFont = () => setFontStep((s) => Math.max(0, s - 1))
  const resetFont = () => setFontStep(1)
  const toggleLang = () => setLang((l) => (l === 'en' ? 'hi' : 'en'))

  return (
    <SettingsContext.Provider value={{ fontStep, incFont, decFont, resetFont, lang, setLang, toggleLang }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

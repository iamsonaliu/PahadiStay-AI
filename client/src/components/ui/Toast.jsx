/**
 * Toast
 * Thin wrapper around react-hot-toast that applies PahadiStay's visual language.
 *
 * Usage:
 *   import { toast, Toaster } from '../ui'
 *   toast.success('Booking confirmed!')
 *   toast.error('Something went wrong.')
 *   toast.info('Itinerary ready — check your email.')
 *   toast.loading('Generating itinerary…')
 *   toast.dismiss()
 *
 * Place <Toaster /> once at the root of your app (already added in App.jsx).
 *
 * @param {string}  message  - notification text
 * @param {string}  type     - 'success' | 'error' | 'info' | 'loading'
 * @param {object}  options  - react-hot-toast ToastOptions (duration, icon, etc.)
 */

import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast'

// --- custom visual styles per type ---
const baseStyle = {
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '500',
  maxWidth: '360px',
  padding: '10px 14px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
}

const styles = {
  success: { ...baseStyle, background: '#1a3a2a', color: '#f5f0e8', border: '1px solid #2d6a4f' },
  error:   { ...baseStyle, background: '#fff',    color: '#b91c1c', border: '1px solid #fca5a5' },
  info:    { ...baseStyle, background: '#fff',    color: '#1a3a2a', border: '1px solid #d9ede2' },
  loading: { ...baseStyle, background: '#fff',    color: '#1a3a2a', border: '1px solid #d9ede2' },
}

// --- toast helper object ---
export const toast = {
  success: (message, options = {}) =>
    hotToast.success(message, { style: styles.success, duration: 3000, ...options }),

  error: (message, options = {}) =>
    hotToast.error(message, { style: styles.error, duration: 4000, ...options }),

  info: (message, options = {}) =>
    hotToast(message, {
      style: styles.info,
      duration: 3500,
      ...options,
    }),

  loading: (message, options = {}) =>
    hotToast.loading(message, { style: styles.loading, ...options }),

  dismiss: hotToast.dismiss,
}

// --- Toaster placement (drop this once in App root) ---
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      toastOptions={{
        style: baseStyle,
      }}
    />
  )
}

// --- Inline Toast demo component (used on showcase page) ---
export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => toast.success('Booking confirmed!')}
        className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Success toast
      </button>
      <button
        onClick={() => toast.error('Unable to connect. Please try again.')}
        className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Error toast
      </button>
      <button
        onClick={() => toast.info('Your AI itinerary is ready!')}
        className="px-3 py-1.5 text-xs bg-forest-900 text-white rounded-md hover:bg-forest-800"
      >
        Info toast
      </button>
      <button
        onClick={() => {
          const id = toast.loading('Generating itinerary…')
          setTimeout(() => { hotToast.dismiss(id); toast.success('Itinerary ready!') }, 2000)
        }}
        className="px-3 py-1.5 text-xs bg-terra-500 text-white rounded-md hover:bg-terra-600"
      >
        Loading → success
      </button>
    </div>
  )
}
/**
 * Modal
 * @param {boolean}  isOpen    - controls visibility
 * @param {function} onClose   - called when the user closes the modal
 * @param {string}   title     - header title text
 * @param {string}   size      - 'sm' | 'md' | 'lg' | 'xl' (default 'md')
 * @param {boolean}  hideClose - hides the × button when true
 * @param {node}     children  - modal body content
 * @param {node}     footer    - optional footer slot (e.g., action buttons)
 */

import { useEffect, useRef } from 'react'

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  hideClose = false,
  children,
  footer,
}) {
  const dialogRef = useRef(null)
  const closeRef  = useRef(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Focus the close button when the modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeRef.current?.focus(), 0)
    }
  }, [isOpen])

  // Prevent scroll on body while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={[
          'relative w-full rounded-2xl bg-white shadow-xl z-10',
          'dark:bg-gray-900 dark:border dark:border-gray-700',
          sizeMap[size] ?? sizeMap.md,
        ].join(' ')}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-forest-900 dark:text-cream-100">
                {title}
              </h2>
            )}
            {!hideClose && (
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close modal"
                className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                           dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
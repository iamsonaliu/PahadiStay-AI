import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button, Input, Modal, Loader, Skeleton } from '../components/ui'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [inputErr, setInputErr] = useState('')

  function handleBlur() {
    if (!inputVal.trim()) setInputErr('This field is required')
    else setInputErr('')
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-14">

        <h1 className="text-2xl font-bold text-forest-900 dark:text-white">
          UI Component Showcase
        </h1>

        {/* Button */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Button</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Input */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Input</h2>
          <div className="space-y-4 max-w-sm">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onBlur={handleBlur}
              error={inputErr}
            />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Modal</h2>
          <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              This modal traps focus and closes on Escape or backdrop click.
            </p>
            <div className="mt-4 flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </section>

        {/* Toast */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Toast</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={() => toast.success('Success!')}>
              Success Toast
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.error('Something went wrong.')}>
              Error Toast
            </Button>
            <Button variant="secondary" size="sm" onClick={() => toast('Info message.')}>
              Info Toast
            </Button>
          </div>
        </section>

        {/* Loader */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Loader</h2>
          <div className="flex flex-wrap gap-8 items-center">
            <div>
              <p className="text-xs text-gray-400 mb-2">Spinner sm</p>
              <Loader size="sm" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Spinner md</p>
              <Loader size="md" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Spinner lg</p>
              <Loader size="lg" />
            </div>
            <div className="w-48">
              <p className="text-xs text-gray-400 mb-2">Skeleton</p>
              <Skeleton lines={3} />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
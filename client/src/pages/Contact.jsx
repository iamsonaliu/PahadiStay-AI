import { useState } from 'react'
import toast from 'react-hot-toast'

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success("Thanks! We'll get back to you soon.")
    setForm(initialForm)
  }

  return (
    <section className="bg-cream-100 dark:bg-forest-900">
      <div className="container-px section">
        <div className="max-w-3xl mb-10 animate-fade-up">
          <p className="eyebrow mb-3">Contact us</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let’s talk about your Uttarakhand stay.</h1>
          <p className="text-gray-600 dark:text-cream-100/70 text-lg">Questions from hosts, travellers, and collaborators are always welcome.</p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5 animate-fade-up">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input id="name" name="name" className="input" value={form.name} onChange={update} required placeholder="Your name" />
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" className="input" value={form.email} onChange={update} required placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="subject">Subject</label>
              <input id="subject" name="subject" className="input" value={form.subject} onChange={update} required placeholder="Listing, booking, partnership…" />
            </div>
            <div>
              <label className="label" htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" className="input resize-none" value={form.message} onChange={update} required placeholder="Tell us how we can help." />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">Send message</button>
          </form>

          <aside className="space-y-5 animate-fade-up animate-delay-100">
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-5">Reach PahadiStay AI</h2>
              <div className="space-y-4 text-gray-600 dark:text-cream-100/75">
                <p><span className="font-semibold text-forest-700 dark:text-cream-50">Email:</span> hello@pahadistay.ai</p>
                <p><span className="font-semibold text-forest-700 dark:text-cream-50">Phone:</span> +91-XXXX</p>
                <p><span className="font-semibold text-forest-700 dark:text-cream-50">Address:</span> Dehradun, Uttarakhand</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Instagram', 'LinkedIn', 'WhatsApp'].map((social) => <a key={social} href="#" className="pill bg-forest-50 text-forest-700 hover:bg-forest-100 dark:bg-white/10 dark:text-cream-50">{social}</a>)}
              </div>
            </div>
            <div className="card overflow-hidden p-2">
              <iframe
                title="Map of Uttarakhand"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.5%2C28.7%2C81.1%2C31.5&layer=mapnik"
                className="h-80 w-full rounded-2xl border-0"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

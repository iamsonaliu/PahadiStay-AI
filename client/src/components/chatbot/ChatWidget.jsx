import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaCommentDots, FaXmark, FaMountainSun, FaPaperPlane } from 'react-icons/fa6'
import { aiService } from '../../services/api'

const SUGGESTIONS = [
  'Best time to visit Chopta?',
  'Suggest a 3-day Nainital trip',
  'Where can I see snow in December?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Namaste! I'm your Uttarakhand travel guide. Ask me about homestays, treks, weather or the Char Dham." },
  ])
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  async function send(text) {
    const msg = (text ?? input).trim()
    if (!msg || sending) return
    setInput('')
    const history = messages.slice(-6)
    setMessages((m) => [...m, { role: 'user', content: msg }])
    setSending(true)
    try {
      const res = await aiService.chat({ message: msg, history })
      setMessages((m) => [...m, { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[1100] w-14 h-14 rounded-full bg-saffron-gradient text-white shadow-card grid place-items-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Open travel assistant"
      >
        {open ? <FaXmark className="w-6 h-6" /> : <FaCommentDots className="w-6 h-6" />}
      </button>

      {/* panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[1100] w-[90vw] max-w-sm h-[70vh] max-h-[560px] flex flex-col card !rounded-3xl overflow-hidden animate-fade-up">
          <div className="bg-forest-gradient text-white px-4 py-3 flex items-center gap-3">
            <span className="w-9 h-9 grid place-items-center rounded-full bg-white/15">
              <FaMountainSun className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-sm leading-tight">PahadiStay Assistant</p>
              <p className="text-[11px] text-white/70">AI travel guide · online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-cream-100/60 dark:bg-forest-900">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-forest-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-forest-800 text-gray-700 dark:text-cream-100 shadow-soft rounded-bl-sm ai-prose'
                }`}>
                  {m.role === 'assistant' ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-forest-800 px-4 py-3 rounded-2xl shadow-soft flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] text-forest-700 bg-forest-50 hover:bg-forest-100 px-2.5 py-1 rounded-full">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send() }} className="p-2 border-t border-cream-200 dark:border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your trip…"
              className="flex-1 px-3 py-2 rounded-xl bg-cream-100 dark:bg-forest-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <button type="submit" disabled={sending} className="btn-primary !px-4 !py-2 disabled:opacity-50" aria-label="Send">
              <FaPaperPlane className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

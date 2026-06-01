import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Sprout from '../components/Sprout'

interface Slide {
  title: string
  body: string
  emoji: string
}

const slides: Slide[] = [
  {
    emoji: '🌍',
    title: 'In a world of more,',
    body: 'we practice less. Dwell turns boredom into a tiny daily ritual that calms your nervous system.',
  },
  {
    emoji: '🧠',
    title: 'Stillness is a skill',
    body: 'Under-stimulation lowers cortisol and lets your body downshift out of fight-or-flight. We make it playful.',
  },
  {
    emoji: '🌱',
    title: 'Meet your sprout',
    body: 'A companion that grows every time you pause. No streaks to break, no pressure — just gentle presence.',
  },
]

export default function Onboarding({ onDone }: { onDone: (name: string) => void }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const naming = step === slides.length

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-cream-50 to-sage-100 px-8 pt-20 pb-10">
      {/* progress dots */}
      <div className="mb-6 flex justify-center gap-2">
        {[...slides, 'name'].map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-6 bg-sage-500' : 'w-1.5 bg-sage-200'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {!naming ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 text-7xl">{slides[step].emoji}</div>
              <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight text-bark-800">
                {slides[step].title}
              </h1>
              <p className="max-w-[280px] text-[15px] leading-relaxed text-bark-600">
                {slides[step].body}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="naming"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <Sprout stage={1} size={150} />
              <h1 className="mb-2 mt-4 font-serif text-2xl font-semibold text-bark-800">
                Name your sprout
              </h1>
              <p className="mb-6 max-w-[260px] text-sm text-bark-600">
                You'll grow it together, one quiet moment at a time.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fern, Pip, Moss…"
                className="w-full max-w-[260px] rounded-2xl border-2 border-sage-200 bg-white px-5 py-3 text-center text-lg font-semibold text-bark-700 outline-none focus:border-sage-400"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => (naming ? onDone(name.trim() || 'Fern') : setStep((s) => s + 1))}
        className="flex items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-bold text-cream-50 shadow-soft transition-transform active:scale-[0.98]"
      >
        {naming ? 'Begin' : 'Next'}
        <ArrowRight size={20} />
      </button>
    </div>
  )
}

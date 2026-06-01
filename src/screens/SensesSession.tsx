import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'
import SessionShell from '../components/SessionShell'
import SpeechBubble from '../components/SpeechBubble'

interface SenseStep {
  n: number
  verb: string
  emoji: string
  hint: string
}

// The classic 5-4-3-2-1 grounding sequence.
const STEPS: SenseStep[] = [
  { n: 5, verb: 'see', emoji: '👁️', hint: 'colours, shapes, the quality of the light' },
  { n: 4, verb: 'hear', emoji: '👂', hint: 'listen past the obvious — the room beneath the sounds' },
  { n: 3, verb: 'feel', emoji: '✋', hint: 'textures, temperature, your breath, the floor' },
  { n: 2, verb: 'smell', emoji: '👃', hint: 'the air, something close by' },
  { n: 1, verb: 'taste', emoji: '👅', hint: 'your mouth, a sip of water, the air' },
]

const lines = [
  'no right answers. just notice.',
  'slowly. one at a time.',
  'you’re arriving back in your body.',
  'nice. keep going.',
]

export default function SensesSession({
  minutes,
  sproutName,
  onExit,
  onComplete,
}: {
  minutes: number
  sproutName: string
  onExit: () => void
  onComplete: (minutes: number) => void
}) {
  const [stepIdx, setStepIdx] = useState(0)
  const [logged, setLogged] = useState<string[]>([]) // entries for current step ('' = tapped, unlabeled)
  const [draft, setDraft] = useState('')
  const [lineIdx, setLineIdx] = useState(0)

  const step = STEPS[stepIdx]
  const filled = logged.length
  const complete = filled >= step.n
  const isLast = stepIdx === STEPS.length - 1

  useEffect(() => {
    const id = setInterval(() => setLineIdx((i) => (i + 1) % lines.length), 7000)
    return () => clearInterval(id)
  }, [])

  const addEntry = (label: string) => {
    if (filled >= step.n) return
    setLogged((l) => [...l, label])
    setDraft('')
    try {
      navigator.vibrate?.(8)
    } catch {
      /* optional */
    }
  }

  const next = () => {
    if (isLast) {
      onComplete(minutes)
      return
    }
    setStepIdx((i) => i + 1)
    setLogged([])
    setDraft('')
  }

  const line = useMemo(() => lines[lineIdx], [lineIdx])

  return (
    <SessionShell onExit={onExit}>
      {/* step progress */}
      <div className="mb-6 flex gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s.verb}
            className={`h-1.5 rounded-full transition-all ${
              i < stepIdx ? 'w-6 bg-sage-400' : i === stepIdx ? 'w-6 bg-sage-600' : 'w-1.5 bg-sage-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4 }}
          className="flex w-full flex-col items-center"
        >
          <div className="text-6xl">{step.emoji}</div>
          <h1 className="mt-4 font-serif text-3xl font-semibold text-bark-800">
            {step.n} {step.n === 1 ? 'thing' : 'things'}
          </h1>
          <p className="text-lg font-semibold text-sage-600">you can {step.verb}</p>
          <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-bark-500">{step.hint}</p>

          {/* leaf dots */}
          <div className="mt-7 flex items-center justify-center gap-3">
            {Array.from({ length: step.n }).map((_, i) => {
              const isFilled = i < filled
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => !isFilled && addEntry('')}
                  className={`grid h-11 w-11 place-items-center rounded-full text-lg shadow-soft transition-colors ${
                    isFilled ? 'bg-sage-400' : 'bg-white'
                  }`}
                  aria-label={isFilled ? 'noticed' : 'tap when you notice one'}
                >
                  <motion.span
                    initial={false}
                    animate={{ scale: isFilled ? 1 : 0.6, opacity: isFilled ? 1 : 0.3 }}
                  >
                    🌿
                  </motion.span>
                </motion.button>
              )
            })}
          </div>

          {/* logged labels as soft chips */}
          {logged.some((l) => l) && (
            <div className="mt-4 flex max-w-[300px] flex-wrap justify-center gap-2">
              {logged.filter((l) => l).map((l, i) => (
                <span
                  key={i}
                  className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-700"
                >
                  {l}
                </span>
              ))}
            </div>
          )}

          {/* optional: name what you noticed */}
          {!complete && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (draft.trim()) addEntry(draft.trim())
              }}
              className="mt-5 flex w-full max-w-[300px] items-center gap-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="name one… (optional)"
                className="flex-1 rounded-2xl border-2 border-sage-200 bg-white px-4 py-2.5 text-sm font-medium text-bark-700 outline-none focus:border-sage-400"
              />
              <button
                type="submit"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-500 text-cream-50 active:scale-95"
                aria-label="Log it"
              >
                <Plus size={20} />
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-bark-400">
            tap a leaf each time you notice one — no need to type
          </p>
        </motion.div>
      </AnimatePresence>

      {/* companion + advance */}
      <div className="mt-6 h-12">
        <SpeechBubble text={complete ? `beautiful. — ${sproutName}` : line} />
      </div>

      <AnimatePresence>
        {complete && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={next}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-sage-500 px-8 py-4 text-lg font-bold text-cream-50 shadow-soft active:scale-[0.98]"
          >
            {isLast ? 'Complete' : 'Next sense'}
            <ArrowRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </SessionShell>
  )
}

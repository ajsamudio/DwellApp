import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SessionShell from '../components/SessionShell'
import BreathingCircle from '../components/BreathingCircle'
import SpeechBubble from '../components/SpeechBubble'
import { pickLine, type SessionType } from '../data/mockData'

export default function Session({
  session,
  sproutName,
  onExit,
  onComplete,
}: {
  session: SessionType
  sproutName: string
  onExit: () => void
  onComplete: () => void
}) {
  // Prototype timer: compressed so the flow is quick to demo.
  const total = session.minutes * 6 // ~6s per "minute" for the demo
  const [left, setLeft] = useState(total)
  const [seed, setSeed] = useState(() => Date.now())
  const line = useMemo(() => pickLine('session', seed), [seed])

  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  // rotate the companion's line a couple of times
  useEffect(() => {
    const r = setInterval(() => setSeed(Date.now()), 4000)
    return () => clearInterval(r)
  }, [])

  const done = left <= 0
  const display = `${Math.ceil(left)}s`

  return (
    <SessionShell onExit={onExit}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <span className="mb-1 text-4xl">{session.emoji}</span>
        <h1 className="font-serif text-2xl font-semibold text-bark-800">{session.title}</h1>
        <p className="mb-6 mt-2 max-w-[270px] text-[15px] leading-relaxed text-bark-600">
          {session.prompt}
        </p>

        <BreathingCircle label={done ? 'done' : display} />

        <div className="mt-8 h-12">
          <SpeechBubble text={done ? `that was lovely. — ${sproutName}` : line} />
        </div>

        {done ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="mt-8 rounded-2xl bg-sage-500 px-10 py-4 text-lg font-bold text-cream-50 shadow-soft active:scale-[0.98]"
          >
            Complete
          </motion.button>
        ) : (
          <button
            onClick={onComplete}
            className="mt-8 text-sm font-semibold text-bark-400 underline-offset-4 hover:underline"
          >
            I feel settled — finish now
          </button>
        )}
      </motion.div>
    </SessionShell>
  )
}

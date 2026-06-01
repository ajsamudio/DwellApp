import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Sprout from '../components/Sprout'
import SpeechBubble from '../components/SpeechBubble'
import { pickLine } from '../data/mockData'
import type { GrowthStage } from '../theme/tokens'

const reflections = ['calmer', 'about the same', 'a little restless']

export default function Reward({
  fromStage,
  toStage,
  coins,
  sproutName,
  onContinue,
}: {
  fromStage: GrowthStage
  toStage: GrowthStage
  coins: number
  sproutName: string
  onContinue: () => void
}) {
  const [stage, setStage] = useState<GrowthStage>(fromStage)
  const line = useMemo(() => pickLine('reward'), [])
  const [picked, setPicked] = useState<string | null>(null)

  // grow after a beat
  useEffect(() => {
    const t = setTimeout(() => setStage(toStage), 600)
    return () => clearTimeout(t)
  }, [toStage])

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sage-100 to-cream-50 px-8 pb-10 text-center">
      {/* floating calm coins */}
      <AnimatePresence>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-clay-400"
            initial={{ opacity: 0, y: 40 + i * 6, x: (i - 3) * 38, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -120, scale: 1 }}
            transition={{ duration: 2.4, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
          >
            <Sparkles size={20} />
          </motion.div>
        ))}
      </AnimatePresence>

      <p className="mb-1 text-sm font-bold uppercase tracking-widest text-sage-600">
        you stayed
      </p>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-bark-800">
        {sproutName} grew a little
      </h1>

      <Sprout stage={stage} size={180} />

      <div className="mt-6 h-12">
        <SpeechBubble text={line} />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full bg-clay-100 px-4 py-2">
        <Sparkles size={18} className="text-clay-500" />
        <span className="font-bold text-clay-500">+{coins} Calm Coins</span>
      </div>

      {/* one-tap reflection */}
      <div className="mt-8 w-full">
        <p className="mb-3 text-sm text-bark-500">how does your body feel?</p>
        <div className="flex justify-center gap-2">
          {reflections.map((r) => (
            <button
              key={r}
              onClick={() => setPicked(r)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                picked === r
                  ? 'bg-sage-500 text-cream-50'
                  : 'bg-white text-bark-600 shadow-soft'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-8 w-full rounded-2xl bg-sage-500 py-4 text-lg font-bold text-cream-50 shadow-soft active:scale-[0.98]"
      >
        Continue
      </button>
    </div>
  )
}

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock } from 'lucide-react'
import Sprout from '../components/Sprout'
import SpeechBubble from '../components/SpeechBubble'
import { garden, pickLine } from '../data/mockData'
import type { ProgressState } from '../data/mockData'
import { growthLabels } from '../theme/tokens'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Garden({
  progress,
  sproutName,
  onBack,
}: {
  progress: ProgressState
  sproutName: string
  onBack: () => void
}) {
  const line = useMemo(() => pickLine('garden'), [])

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-sage-100 to-cream-50">
      <div className="flex items-center gap-3 px-6 pt-12">
        <button
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-bark-600"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-semibold text-bark-800">Your garden</h1>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-10 pt-4">
        {/* Hero companion */}
        <div className="flex flex-col items-center">
          <Sprout stage={progress.stage} size={170} />
          <p className="mt-2 font-serif text-xl font-semibold text-bark-800">{sproutName}</p>
          <p className="text-sm text-bark-400">{growthLabels[progress.stage]} · Level {progress.level}</p>
          <div className="mt-3">
            <SpeechBubble text={line} />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-1.5 text-clay-500">
              <Clock size={16} />
              <span className="text-2xl font-extrabold">{progress.totalMinutes}</span>
            </div>
            <p className="text-xs font-semibold text-bark-400">calm minutes</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-soft">
            <span className="text-2xl font-extrabold text-sage-600">{progress.calmCoins}</span>
            <p className="text-xs font-semibold text-bark-400">calm coins</p>
          </div>
        </div>

        {/* Gentle rhythm — NOT a punishing streak */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <p className="mb-1 text-sm font-bold text-bark-700">your rhythm</p>
          <p className="mb-3 text-xs text-bark-400">
            pauses this week — missing a day is okay 🤍
          </p>
          <div className="flex justify-between">
            {progress.rhythm.map((on, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm ${
                    on ? 'bg-sage-300' : 'bg-cream-200'
                  }`}
                >
                  {on ? '🌿' : ''}
                </div>
                <span className="text-[11px] font-semibold text-bark-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planted moments */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-soft">
          <p className="mb-3 text-sm font-bold text-bark-700">planted moments</p>
          <div className="flex flex-wrap gap-3">
            {garden.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="flex w-[64px] flex-col items-center"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sage-100 text-2xl">
                  {p.emoji}
                </div>
                <span className="mt-1 text-center text-[10px] font-semibold leading-tight text-bark-400">
                  {p.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

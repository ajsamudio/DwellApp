import { motion } from 'framer-motion'
import { ChevronLeft, Clock } from 'lucide-react'
import { sessionTypes, type SessionType } from '../data/mockData'

export default function SessionPicker({
  onBack,
  onPick,
  highlightKind,
}: {
  onBack: () => void
  onPick: (s: SessionType) => void
  highlightKind?: string
}) {
  return (
    <div className="flex h-full flex-col bg-cream-50 px-6 pt-12 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-full bg-cream-200 text-bark-600"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bark-800">Choose a pause</h1>
          <p className="text-sm text-bark-400">a few quiet minutes is plenty</p>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-4">
        {sessionTypes.map((s, i) => {
          const featured = s.kind === highlightKind
          return (
            <motion.button
              key={s.kind}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(s)}
              className={`flex items-center gap-4 rounded-4xl border-2 p-4 text-left shadow-soft transition-colors ${
                featured
                  ? 'border-sage-400 bg-sage-100'
                  : 'border-transparent bg-white'
              }`}
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-cream-100 text-2xl">
                {s.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-bark-800">{s.title}</h2>
                  {featured && (
                    <span className="rounded-full bg-sage-500 px-2 py-0.5 text-[10px] font-bold text-cream-50">
                      next
                    </span>
                  )}
                </div>
                <p className="text-sm text-bark-500">{s.tagline}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-bark-400">
                <Clock size={13} />
                {s.minutes}m
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Check, Lock, Star } from 'lucide-react'
import type { PathNodeData } from '../data/mockData'
import { getSession } from '../data/mockData'

// A single node on the winding presence journey.
export default function PathNode({
  node,
  offset,
  onTap,
}: {
  node: PathNodeData
  offset: number // horizontal sway, in px
  onTap: () => void
}) {
  const session = getSession(node.kind)
  const isLocked = node.state === 'locked'
  const isCurrent = node.state === 'current'

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {isCurrent && (
        <motion.div
          initial={{ y: 4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-2 rounded-full bg-sage-600 px-3 py-1 text-xs font-bold text-cream-50 shadow-soft"
        >
          start
        </motion.div>
      )}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onTap}
        disabled={isLocked}
        className={[
          'relative grid h-[68px] w-[68px] place-items-center rounded-full text-2xl shadow-soft transition-colors',
          node.state === 'done' && 'bg-sage-300',
          isCurrent && 'bg-sage-500 ring-4 ring-sage-200',
          isLocked && 'bg-cream-200 opacity-70',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={`${session.title} — ${node.state}`}
      >
        {isCurrent && (
          <motion.span
            className="absolute inset-0 rounded-full ring-4 ring-sage-400"
            animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        {node.state === 'done' ? (
          <Check className="text-cream-50" />
        ) : isLocked ? (
          <Lock size={22} className="text-barkSoft text-bark-400" />
        ) : (
          <span>{session.emoji}</span>
        )}
      </motion.button>
      <span
        className={[
          'mt-2 text-xs font-semibold',
          isLocked ? 'text-bark-400/70' : 'text-bark-600',
        ].join(' ')}
      >
        {node.label}
      </span>
      {node.state === 'done' && (
        <Star size={12} className="mt-0.5 fill-clay-300 text-clay-300" />
      )}
    </div>
  )
}

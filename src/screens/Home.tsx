import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import TopBar from '../components/TopBar'
import PathNode from '../components/PathNode'
import Sprout from '../components/Sprout'
import SpeechBubble from '../components/SpeechBubble'
import { journey, pickLine, type PathNodeData } from '../data/mockData'
import type { ProgressState } from '../data/mockData'

// Sway pattern for the winding path.
const sway = [0, 46, 70, 36, -30, -58]

export default function Home({
  progress,
  sproutName,
  onOpenSession,
  onProfile,
  onGarden,
}: {
  progress: ProgressState
  sproutName: string
  onOpenSession: (node: PathNodeData) => void
  onProfile: () => void
  onGarden: () => void
}) {
  const [seed] = useState(() => Date.now())
  const line = useMemo(() => pickLine('idle', seed), [seed])

  return (
    <div className="flex h-full flex-col bg-cream-50">
      <TopBar level={progress.level} calmCoins={progress.calmCoins} onProfile={onProfile} />

      <div className="px-6 pb-2">
        <h1 className="font-serif text-2xl font-semibold text-bark-800">Your path</h1>
        <p className="text-sm text-bark-400">slow and steady · no streaks to break</p>
      </div>

      {/* Winding journey */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-44 pt-2">
        <div className="flex flex-col items-center gap-7">
          {journey.map((node, i) => (
            <PathNode
              key={node.id}
              node={node}
              offset={sway[i % sway.length]}
              onTap={() => onOpenSession(node)}
            />
          ))}
        </div>
      </div>

      {/* Companion dock */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-x-0 bottom-0 flex items-end gap-3 bg-gradient-to-t from-cream-50 via-cream-50 to-transparent px-6 pb-7 pt-10"
      >
        <button onClick={onGarden} className="shrink-0" aria-label="Open garden">
          <Sprout stage={progress.stage} size={104} />
        </button>
        <div className="mb-6">
          <SpeechBubble text={line} />
          <p className="mt-2 pl-2 text-xs font-semibold text-bark-400">— {sproutName}</p>
        </div>
      </motion.div>
    </div>
  )
}

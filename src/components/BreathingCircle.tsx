import { motion } from 'framer-motion'

// A slow expanding/contracting circle that paces the breath during a session.
// One full cycle ~ 10s (4s in, 6s out) — calming, longer exhale.
export default function BreathingCircle({ label }: { label?: string }) {
  return (
    <div className="relative grid h-64 w-64 place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-sage-300/30"
          style={{ width: 256, height: 256 }}
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}
      <motion.div
        className="grid h-32 w-32 place-items-center rounded-full bg-sage-400 text-cream-50 shadow-soft"
        animate={{ scale: [0.85, 1.1, 0.85] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-sm font-semibold">{label ?? 'breathe'}</span>
      </motion.div>
    </div>
  )
}

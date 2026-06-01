import { motion } from 'framer-motion'
import type { GrowthStage } from '../theme/tokens'

interface SproutProps {
  stage: GrowthStage
  size?: number
  breathing?: boolean
}

// The companion. An SVG plant in a clay pot that grows with practice and
// breathes slowly (parasympathetic-friendly motion).
export default function Sprout({ stage, size = 140, breathing = true }: SproutProps) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={breathing ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative select-none"
      aria-label="Your sprout companion"
    >
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
        {/* Pot */}
        <path
          d="M32 78 h56 l-6 30 a6 6 0 0 1 -6 5 h-26 a6 6 0 0 1 -6 -5 z"
          fill="#B98364"
        />
        <rect x="28" y="72" width="64" height="10" rx="5" fill="#CDA084" />

        {/* Soil */}
        <ellipse cx="60" cy="76" rx="28" ry="5" fill="#5E4F42" />

        {/* Stem + leaves grow by stage */}
        {stage >= 1 && (
          <motion.path
            d="M60 76 C60 64 60 58 60 50"
            stroke="#54704A"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}

        {/* First pair of leaves */}
        {stage >= 1 && (
          <>
            <motion.path
              d="M60 64 C48 60 42 64 40 56 C50 52 58 56 60 64 Z"
              fill="#85A574"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{ transformOrigin: '60px 64px' }}
            />
            <motion.path
              d="M60 64 C72 60 78 64 80 56 C70 52 62 56 60 64 Z"
              fill="#A6BE97"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: '60px 64px' }}
            />
          </>
        )}

        {/* Taller stem + upper leaves */}
        {stage >= 2 && (
          <>
            <motion.path
              d="M60 52 C60 44 60 40 60 34"
              stroke="#54704A"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d="M60 48 C50 44 45 47 44 40 C53 37 59 41 60 48 Z"
              fill="#85A574"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ transformOrigin: '60px 48px' }}
            />
            <motion.path
              d="M60 44 C70 40 75 43 76 36 C67 33 61 37 60 44 Z"
              fill="#A6BE97"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ transformOrigin: '60px 44px' }}
            />
          </>
        )}

        {/* A bud */}
        {stage >= 3 && (
          <motion.circle
            cx="60"
            cy="30"
            r="6"
            fill="#CDA084"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        )}

        {/* Bloom + falling-petal serenity */}
        {stage >= 4 && (
          <motion.g
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ transformOrigin: '60px 28px' }}
          >
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx="60"
                cy="18"
                rx="6"
                ry="10"
                fill="#E0C2AC"
                transform={`rotate(${a} 60 28)`}
              />
            ))}
            <circle cx="60" cy="28" r="5" fill="#B98364" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  )
}

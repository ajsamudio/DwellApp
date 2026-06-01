import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import SessionShell from '../components/SessionShell'
import SpeechBubble from '../components/SpeechBubble'
import Sprout from '../components/Sprout'
import { startAmbient, stopAmbient } from '../audio/ambient'
import type { GrowthStage } from '../theme/tokens'

const DURATIONS = [1, 3, 5, 10] // minutes

// Gentle lines that rotate during the sit.
const stayLines = [
  'put the phone down. let it rest face-down.',
  'the urge to check will pass. watch it go.',
  'nothing to do. nowhere to be.',
  'let a thought drift in… and back out.',
  'boredom is the soil i grow in.',
  'soften your jaw. drop your shoulders.',
]

type Phase = 'setup' | 'running' | 'paused'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function BoredomTimer({
  stage,
  sproutName,
  soundOn,
  onToggleSound,
  onExit,
  onComplete,
}: {
  stage: GrowthStage
  sproutName: string
  soundOn: boolean
  onToggleSound: () => void
  onExit: () => void
  onComplete: (minutes: number, fidgets: number) => void
}) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [minutes, setMinutes] = useState(3)
  const [remaining, setRemaining] = useState(180) // seconds
  const [fidgets, setFidgets] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)

  // Accurate timing: track an absolute end-time so backgrounding / locking
  // the phone doesn't drift the countdown.
  const endAtRef = useRef<number>(0)
  const total = minutes * 60

  const start = useCallback(() => {
    endAtRef.current = Date.now() + remaining * 1000
    setPhase('running')
  }, [remaining])

  const begin = (mins: number) => {
    setMinutes(mins)
    setRemaining(mins * 60)
    endAtRef.current = Date.now() + mins * 60 * 1000
    setFidgets(0)
    setPhase('running')
  }

  const pause = () => {
    setPhase('paused')
  }

  // Tick loop while running.
  useEffect(() => {
    if (phase !== 'running') return
    const id = setInterval(() => {
      const left = Math.max(0, (endAtRef.current - Date.now()) / 1000)
      setRemaining(left)
      if (left <= 0) {
        clearInterval(id)
        try {
          navigator.vibrate?.([40, 60, 40])
        } catch {
          /* haptics optional */
        }
        onComplete(minutes, fidgets)
      }
    }, 250)
    return () => clearInterval(id)
  }, [phase, minutes, fidgets, onComplete])

  // Rotate the gentle line every ~12s while sitting.
  useEffect(() => {
    if (phase !== 'running') return
    const id = setInterval(() => setLineIdx((i) => (i + 1) % stayLines.length), 12000)
    return () => clearInterval(id)
  }, [phase])

  // Ambient sound: plays only while actively sitting, if enabled.
  useEffect(() => {
    if (phase === 'running' && soundOn) startAmbient()
    else stopAmbient()
  }, [phase, soundOn])

  // Always silence the bed when leaving the timer.
  useEffect(() => () => stopAmbient(), [])

  const progress = total > 0 ? 1 - remaining / total : 0
  const ringLen = 2 * Math.PI * 130

  const line = useMemo(() => stayLines[lineIdx], [lineIdx])

  // Tapping the calm area = a little "fidget" — noticed, never judged.
  const onFidget = () => {
    if (phase === 'running') {
      setFidgets((f) => f + 1)
      try {
        navigator.vibrate?.(8)
      } catch {
        /* optional */
      }
    }
  }

  // ---- SETUP -----------------------------------------------------------
  if (phase === 'setup') {
    return (
      <SessionShell onExit={onExit}>
        <span className="mb-1 text-4xl">🫧</span>
        <h1 className="font-serif text-2xl font-semibold text-bark-800">Boredom Timer</h1>
        <p className="mb-7 mt-2 max-w-[270px] text-[15px] leading-relaxed text-bark-600">
          Choose how long to do nothing. No tasks, no scrolling — just you and a few
          honest minutes.
        </p>

        <Sprout stage={stage} size={120} />

        <p className="mb-3 mt-7 text-sm font-semibold text-bark-500">how long?</p>
        <div className="grid grid-cols-4 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setMinutes(d)}
              className={`flex flex-col items-center rounded-2xl px-4 py-3 text-sm font-bold shadow-soft transition-colors ${
                minutes === d ? 'bg-sage-500 text-cream-50' : 'bg-white text-bark-600'
              }`}
            >
              <span className="text-lg">{d}</span>
              <span className="text-[11px] font-semibold opacity-80">min</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => begin(minutes)}
          className="mt-9 w-full rounded-2xl bg-sage-500 py-4 text-lg font-bold text-cream-50 shadow-soft active:scale-[0.98]"
        >
          Begin sitting
        </button>
      </SessionShell>
    )
  }

  // ---- RUNNING / PAUSED ------------------------------------------------
  return (
    <SessionShell onExit={onExit}>
      <div
        className="flex w-full flex-col items-center"
        onPointerDown={onFidget}
        role="presentation"
      >
        {/* Breathing ring with countdown */}
        <div className="relative grid h-72 w-72 place-items-center">
          {/* soft breathing halos */}
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-sage-300/25"
              style={{ width: 240, height: 240 }}
              animate={
                phase === 'running'
                  ? { scale: [0.7, 1, 0.7], opacity: [0.15, 0.4, 0.15] }
                  : { scale: 0.85, opacity: 0.2 }
              }
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            />
          ))}

          {/* progress ring */}
          <svg className="absolute h-72 w-72 -rotate-90" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="130" fill="none" stroke="#E3EADD" strokeWidth="8" />
            <circle
              cx="140"
              cy="140"
              r="130"
              fill="none"
              stroke="#6B8B5C"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={ringLen}
              strokeDashoffset={ringLen * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.25s linear' }}
            />
          </svg>

          {/* breathing core */}
          <motion.div
            className="grid h-40 w-40 place-items-center rounded-full bg-sage-400/90 text-cream-50 shadow-soft"
            animate={
              phase === 'running' ? { scale: [0.9, 1.06, 0.9] } : { scale: 0.95 }
            }
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="text-center">
              <div className="font-serif text-4xl font-semibold tabular-nums">
                {fmt(remaining)}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-widest opacity-80">
                {phase === 'paused' ? 'paused' : 'be here'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* rotating gentle line */}
        <div className="mt-7 h-12">
          <AnimatePresence mode="wait">
            <motion.div key={phase === 'paused' ? 'paused' : line}>
              <SpeechBubble
                text={phase === 'paused' ? `i'll wait. — ${sproutName}` : line}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-sage-600 shadow-soft active:scale-95"
            aria-label={soundOn ? 'Mute ambient sound' : 'Play ambient sound'}
          >
            {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          <button
            onClick={phase === 'running' ? pause : start}
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-sage-600 shadow-soft active:scale-95"
            aria-label={phase === 'running' ? 'Pause' : 'Resume'}
          >
            {phase === 'running' ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            onClick={() => onComplete(minutes, fidgets)}
            className="rounded-2xl bg-sage-500 px-6 py-3.5 text-base font-bold text-cream-50 shadow-soft active:scale-[0.98]"
          >
            I feel settled
          </button>
        </div>

        {/* gentle, non-judgmental fidget note */}
        {fidgets > 0 && (
          <p className="mt-4 text-xs font-medium text-bark-400">
            {fidgets} little urge{fidgets > 1 ? 's' : ''} to fidget — totally human 🤍
          </p>
        )}
      </div>
    </SessionShell>
  )
}

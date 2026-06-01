import type { GrowthStage } from '../theme/tokens'

// ---- Session types (the "lessons") -------------------------------------

export type SessionKind = 'boredom' | 'grounding' | 'singletask' | 'noticing'

export interface SessionType {
  kind: SessionKind
  title: string
  tagline: string
  minutes: number
  emoji: string
  // gentle instruction shown during the active session
  prompt: string
}

export const sessionTypes: SessionType[] = [
  {
    kind: 'boredom',
    title: 'Boredom Timer',
    tagline: 'Do nothing. On purpose.',
    minutes: 3,
    emoji: '🫧',
    prompt: 'Put the phone down. Let your mind wander. There is nothing to fix.',
  },
  {
    kind: 'grounding',
    title: 'Senses Check-in',
    tagline: '5 · 4 · 3 · 2 · 1 — come back to now.',
    minutes: 4,
    emoji: '🌿',
    prompt: 'Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.',
  },
  {
    kind: 'singletask',
    title: 'One Slow Thing',
    tagline: 'Do a small task, fully present.',
    minutes: 5,
    emoji: '🍵',
    prompt: 'Pick one mundane thing — sip tea, wash a cup. Be entirely with it.',
  },
  {
    kind: 'noticing',
    title: 'Noticing Quest',
    tagline: 'Go find something ordinary & lovely.',
    minutes: 2,
    emoji: '🔎',
    prompt: 'Find one thing nearby you have never truly looked at. Study it.',
  },
]

export function getSession(kind: SessionKind): SessionType {
  return sessionTypes.find((s) => s.kind === kind) ?? sessionTypes[0]
}

// ---- Journey path (Duolingo-style nodes) -------------------------------

export interface PathNodeData {
  id: number
  kind: SessionKind
  state: 'done' | 'current' | 'locked'
  label: string
}

export const journey: PathNodeData[] = [
  { id: 1, kind: 'boredom', state: 'done', label: 'First stillness' },
  { id: 2, kind: 'grounding', state: 'done', label: 'Senses' },
  { id: 3, kind: 'noticing', state: 'current', label: 'Notice' },
  { id: 4, kind: 'singletask', state: 'locked', label: 'One slow thing' },
  { id: 5, kind: 'boredom', state: 'locked', label: 'Longer pause' },
  { id: 6, kind: 'grounding', state: 'locked', label: 'Breath' },
]

// ---- Companion (Sprout) speech lines, by context -----------------------

export type SpeechContext = 'idle' | 'session' | 'reward' | 'garden'

export const speechLines: Record<SpeechContext, string[]> = {
  idle: [
    'nothing to do right now — lovely.',
    'we can just be here for a sec.',
    'no rush. the world can wait.',
    'breathe with me?',
  ],
  session: [
    'you’re doing it. just staying.',
    'let the thoughts drift past.',
    'boredom is the soil i grow in.',
    'soften your shoulders.',
  ],
  reward: [
    'you stayed. that’s enough.',
    'i grew a little because of you.',
    'see? less really is more.',
    'your nervous system thanks you.',
  ],
  garden: [
    'look how far we’ve slowed down.',
    'every quiet moment is planted here.',
    'this garden is just calm, made visible.',
  ],
}

export function pickLine(ctx: SpeechContext, seed = Date.now()): string {
  const lines = speechLines[ctx]
  return lines[Math.floor(seed / 1000) % lines.length]
}

// ---- Faked progress / garden state -------------------------------------

export interface ProgressState {
  calmCoins: number
  level: number
  stage: GrowthStage
  totalMinutes: number
  // gentle, non-punishing rhythm: how many of the last 7 days had a pause
  rhythm: boolean[]
}

export const initialProgress: ProgressState = {
  calmCoins: 240,
  level: 3,
  stage: 2,
  totalMinutes: 86,
  rhythm: [true, true, false, true, true, false, false],
}

// Plants already growing in the garden (faked).
export interface GardenPlant {
  id: number
  emoji: string
  name: string
}

export const garden: GardenPlant[] = [
  { id: 1, emoji: '🌱', name: 'First stillness' },
  { id: 2, emoji: '🌿', name: 'Senses' },
  { id: 3, emoji: '🍃', name: 'Quiet morning' },
  { id: 4, emoji: '🌾', name: 'Slow tea' },
  { id: 5, emoji: '🌼', name: 'A long pause' },
]

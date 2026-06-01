// Soft & earthy design tokens shared across the prototype.
// Kept in TS (not just Tailwind) so logic/animation can reference them too.

export const palette = {
  cream: '#FBF8F2',
  creamDeep: '#F5EFE3',
  sage: '#6B8B5C',
  sageSoft: '#A6BE97',
  sageMist: '#E3EADD',
  clay: '#B98364',
  claySoft: '#E0C2AC',
  bark: '#5E4F42',
  barkSoft: '#8A7766',
} as const

// Sprout growth stages — the companion grows as you practice presence.
export type GrowthStage = 0 | 1 | 2 | 3 | 4

export const growthLabels: Record<GrowthStage, string> = {
  0: 'Seed',
  1: 'Sprout',
  2: 'Seedling',
  3: 'Young plant',
  4: 'Flourishing',
}

// Slow, parasympathetic-friendly motion. Nothing snappy.
export const calmTransition = {
  type: 'tween',
  ease: [0.22, 0.61, 0.36, 1],
  duration: 0.7,
} as const

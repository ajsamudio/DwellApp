import { initialProgress, type ProgressState } from './mockData'

// Lightweight localStorage persistence so coins/growth/name survive refreshes
// and returning users skip onboarding.

const KEY = 'dwell.v1'

export interface SavedState {
  progress: ProgressState
  sproutName: string
  onboarded: boolean
  soundOn: boolean
}

export const defaultSaved: SavedState = {
  progress: initialProgress,
  sproutName: 'Fern',
  onboarded: false,
  soundOn: true,
}

export function loadSaved(): SavedState {
  if (typeof localStorage === 'undefined') return defaultSaved
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultSaved
    const parsed = JSON.parse(raw)
    // shallow-merge so new fields fall back to defaults
    return {
      ...defaultSaved,
      ...parsed,
      progress: { ...defaultSaved.progress, ...(parsed.progress ?? {}) },
    }
  } catch {
    return defaultSaved
  }
}

export function saveSaved(state: SavedState) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or unavailable — non-fatal for a prototype */
  }
}

export function clearSaved() {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* non-fatal */
  }
}

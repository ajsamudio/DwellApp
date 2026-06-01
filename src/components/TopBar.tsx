import { Sparkles, Leaf } from 'lucide-react'

// Level + Calm Coins. Calm Coins reward stillness, not doing-more.
export default function TopBar({
  level,
  calmCoins,
  onProfile,
}: {
  level: number
  calmCoins: number
  onProfile?: () => void
}) {
  return (
    <div className="flex items-center justify-between px-6 pt-12 pb-2">
      <div className="flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1.5">
        <Leaf size={16} className="text-sage-600" />
        <span className="text-sm font-bold text-sage-700">Lv {level}</span>
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-clay-100 px-3 py-1.5">
        <Sparkles size={16} className="text-clay-500" />
        <span className="text-sm font-bold text-clay-500">{calmCoins}</span>
      </div>

      <button
        onClick={onProfile}
        className="grid h-9 w-9 place-items-center rounded-full bg-cream-200 text-bark-600"
        aria-label="Profile"
      >
        <span className="text-sm font-bold">🙂</span>
      </button>
    </div>
  )
}

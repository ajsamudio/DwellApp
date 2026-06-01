import type { ReactNode } from 'react'
import { X } from 'lucide-react'

// Reusable container for an active session: soft full-bleed calm background,
// a quiet exit, and centered content.
export default function SessionShell({
  children,
  onExit,
}: {
  children: ReactNode
  onExit: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-sage-100 to-cream-100">
      <div className="flex justify-end px-6 pt-12">
        <button
          onClick={onExit}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-bark-600"
          aria-label="Leave session"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-10 text-center">
        {children}
      </div>
    </div>
  )
}

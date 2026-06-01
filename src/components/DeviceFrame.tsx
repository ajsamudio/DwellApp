import type { ReactNode } from 'react'

// iPhone-style shell so the prototype reads as a native mobile app.
export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-4 sm:p-8">
      <div className="relative">
        {/* Device body */}
        <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[3.2rem] border-[14px] border-bark-900 bg-cream-50 shadow-soft-lg">
          {/* Status bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-7 pt-3 text-[13px] font-semibold text-bark-600">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="text-[11px]">●●●</span>
              <span className="ml-1 inline-block h-3 w-6 rounded-[3px] border border-bark-600/70" />
            </span>
          </div>
          {/* Dynamic-island notch */}
          <div className="absolute left-1/2 top-2 z-40 h-7 w-28 -translate-x-1/2 rounded-full bg-bark-900" />
          {/* Screen content */}
          <div className="no-scrollbar h-full w-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

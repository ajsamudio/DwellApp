import { useState } from 'react'
import {
  ChevronLeft,
  Bell,
  Palette,
  Volume2,
  Heart,
  RotateCcw,
  Download,
  Share,
  Check,
} from 'lucide-react'
import Sprout from '../components/Sprout'
import type { ProgressState } from '../data/mockData'
import { growthLabels } from '../theme/tokens'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
        on ? 'bg-sage-500' : 'bg-cream-200'
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}

export default function Profile({
  progress,
  sproutName,
  soundOn,
  onToggleSound,
  onReset,
  onBack,
}: {
  progress: ProgressState
  sproutName: string
  soundOn: boolean
  onToggleSound: () => void
  onReset: () => void
  onBack: () => void
}) {
  const [reminders, setReminders] = useState(true)
  const { canInstall, promptInstall, isStandalone, isIOS } = useInstallPrompt()

  return (
    <div className="flex h-full flex-col bg-cream-50">
      <div className="flex items-center gap-3 px-6 pt-12 pb-2">
        <button
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-full bg-cream-200 text-bark-600"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-semibold text-bark-800">You & {sproutName}</h1>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-10">
        <div className="mt-2 flex flex-col items-center rounded-4xl bg-white p-6 shadow-soft">
          <Sprout stage={progress.stage} size={120} />
          <p className="mt-2 font-serif text-xl font-semibold text-bark-800">{sproutName}</p>
          <p className="text-sm text-bark-400">
            {growthLabels[progress.stage]} · Level {progress.level}
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <Row icon={<Bell size={18} />} label="Gentle reminders">
            <Toggle on={reminders} onClick={() => setReminders((v) => !v)} />
          </Row>
          <Row icon={<Volume2 size={18} />} label="Ambient sound">
            <Toggle on={soundOn} onClick={onToggleSound} />
          </Row>
          <Row icon={<Palette size={18} />} label="Theme">
            <span className="text-sm font-semibold text-bark-400">Soft earthy</span>
          </Row>
        </div>

        {/* Install as an app */}
        {!isStandalone && (
          <div className="mt-5 rounded-4xl bg-sage-100 p-4">
            {canInstall ? (
              <button
                onClick={promptInstall}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 py-3.5 text-base font-bold text-cream-50 shadow-soft active:scale-[0.98]"
              >
                <Download size={18} />
                Install Dwell
              </button>
            ) : isIOS ? (
              <div className="flex items-start gap-3">
                <Share size={20} className="mt-0.5 shrink-0 text-sage-600" />
                <p className="text-sm leading-relaxed text-bark-600">
                  <span className="font-bold">Add Dwell to your home screen:</span> tap the
                  Share button, then “Add to Home Screen.”
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Download size={20} className="mt-0.5 shrink-0 text-sage-600" />
                <p className="text-sm leading-relaxed text-bark-600">
                  Open Dwell over a secure (https) link to install it as an app on your home
                  screen.
                </p>
              </div>
            )}
          </div>
        )}

        {isStandalone && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-4xl bg-sage-100 py-3 text-sm font-semibold text-sage-700">
            <Check size={16} /> Installed as an app
          </div>
        )}

        <button
          onClick={onReset}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-cream-200 py-3.5 text-sm font-semibold text-bark-500 active:scale-[0.99]"
        >
          <RotateCcw size={16} />
          Reset progress
        </button>

        <div className="mt-6 rounded-4xl bg-sage-100 p-5 text-center">
          <Heart size={20} className="mx-auto mb-2 fill-sage-400 text-sage-400" />
          <p className="text-sm leading-relaxed text-bark-600">
            Dwell has no streaks, no leaderboards, no pressure. Just a quiet place to
            practice doing less.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3.5 shadow-soft">
      <div className="flex items-center gap-3 text-bark-600">
        <span className="text-sage-600">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>
      {children}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DeviceFrame from './components/DeviceFrame'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import SessionPicker from './screens/SessionPicker'
import Session from './screens/Session'
import BoredomTimer from './screens/BoredomTimer'
import SensesSession from './screens/SensesSession'
import Reward from './screens/Reward'
import Garden from './screens/Garden'
import Profile from './screens/Profile'
import {
  getSession,
  type PathNodeData,
  type SessionType,
} from './data/mockData'
import { loadSaved, saveSaved, clearSaved } from './data/storage'
import type { GrowthStage } from './theme/tokens'

const saved = loadSaved()

type Screen =
  | 'onboarding'
  | 'home'
  | 'picker'
  | 'session'
  | 'reward'
  | 'garden'
  | 'profile'

export default function App() {
  // Returning users skip onboarding and resume their saved progress.
  const [screen, setScreen] = useState<Screen>(saved.onboarded ? 'home' : 'onboarding')
  const [sproutName, setSproutName] = useState(saved.sproutName)
  const [progress, setProgress] = useState(saved.progress)
  const [onboarded, setOnboarded] = useState(saved.onboarded)
  const [soundOn, setSoundOn] = useState(saved.soundOn)
  const [active, setActive] = useState<SessionType>(getSession('boredom'))
  const [highlightKind, setHighlightKind] = useState<string | undefined>('noticing')
  // remember stage before a session so Reward can animate the growth
  const [prevStage, setPrevStage] = useState<GrowthStage>(saved.progress.stage)
  const [lastCoins, setLastCoins] = useState(20)

  // Persist whenever durable state changes.
  useEffect(() => {
    saveSaved({ progress, sproutName, onboarded, soundOn })
  }, [progress, sproutName, onboarded, soundOn])

  const go = (s: Screen) => setScreen(s)

  const resetAll = () => {
    clearSaved()
    setProgress(loadSaved().progress)
    setSproutName('Fern')
    setOnboarded(false)
    setSoundOn(true)
    go('onboarding')
  }

  const openSessionFromNode = (node: PathNodeData) => {
    setHighlightKind(node.kind)
    go('picker')
  }

  const pickSession = (s: SessionType) => {
    setActive(s)
    go('session')
  }

  const completeSession = (minutes = active.minutes) => {
    // Calm Coins reward presence, scaled gently to time spent.
    const coins = Math.max(10, minutes * 10)
    setPrevStage(progress.stage)
    setLastCoins(coins)
    setProgress((p) => ({
      ...p,
      calmCoins: p.calmCoins + coins,
      stage: (Math.min(4, p.stage + 1) as GrowthStage),
      totalMinutes: p.totalMinutes + minutes,
    }))
    go('reward')
  }

  return (
    <DeviceFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="h-full"
        >
          {screen === 'onboarding' && (
            <Onboarding
              onDone={(name) => {
                setSproutName(name)
                setOnboarded(true)
                go('home')
              }}
            />
          )}

          {screen === 'home' && (
            <Home
              progress={progress}
              sproutName={sproutName}
              onOpenSession={openSessionFromNode}
              onProfile={() => go('profile')}
              onGarden={() => go('garden')}
            />
          )}

          {screen === 'picker' && (
            <SessionPicker
              highlightKind={highlightKind}
              onBack={() => go('home')}
              onPick={pickSession}
            />
          )}

          {screen === 'session' && active.kind === 'boredom' && (
            <BoredomTimer
              stage={progress.stage}
              sproutName={sproutName}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn((v) => !v)}
              onExit={() => go('home')}
              onComplete={(minutes) => completeSession(minutes)}
            />
          )}

          {screen === 'session' && active.kind === 'grounding' && (
            <SensesSession
              minutes={active.minutes}
              sproutName={sproutName}
              onExit={() => go('home')}
              onComplete={(minutes) => completeSession(minutes)}
            />
          )}

          {screen === 'session' &&
            active.kind !== 'boredom' &&
            active.kind !== 'grounding' && (
              <Session
                session={active}
                sproutName={sproutName}
                onExit={() => go('home')}
                onComplete={() => completeSession()}
              />
            )}

          {screen === 'reward' && (
            <Reward
              fromStage={prevStage}
              toStage={progress.stage}
              coins={lastCoins}
              sproutName={sproutName}
              onContinue={() => go('garden')}
            />
          )}

          {screen === 'garden' && (
            <Garden progress={progress} sproutName={sproutName} onBack={() => go('home')} />
          )}

          {screen === 'profile' && (
            <Profile
              progress={progress}
              sproutName={sproutName}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn((v) => !v)}
              onReset={resetAll}
              onBack={() => go('home')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </DeviceFrame>
  )
}

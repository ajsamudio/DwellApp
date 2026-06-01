// Procedural ambient bed generated with the Web Audio API — no audio files.
// A soft filtered brown-noise "breath/ocean" layer plus a warm low pad, with a
// slow LFO sweeping the filter so it gently breathes. Privacy- & offline-safe.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let nodes: AudioNode[] = []
let running = false

function makeBrownNoiseBuffer(context: AudioContext): AudioBuffer {
  const length = context.sampleRate * 3
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.2
  }
  return buffer
}

export function isAmbientSupported(): boolean {
  return typeof window !== 'undefined' && 'AudioContext' in window
}

// Must be called from a user gesture (a click) so the AudioContext can start.
export function startAmbient(volume = 0.14) {
  if (running) return
  if (!isAmbientSupported()) return
  ctx = ctx ?? new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()

  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // --- brown-noise ocean layer ---
  const noise = ctx.createBufferSource()
  noise.buffer = makeBrownNoiseBuffer(ctx)
  noise.loop = true
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 460
  noiseFilter.Q.value = 0.6
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.9
  noise.connect(noiseFilter).connect(noiseGain).connect(master)
  noise.start()

  // slow LFO that sweeps the filter ~ once every 11s → a breathing texture
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 1 / 11
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 140
  lfo.connect(lfoGain).connect(noiseFilter.frequency)
  lfo.start()

  // --- warm low pad (two detuned sines) ---
  const padGain = ctx.createGain()
  padGain.gain.value = 0.05
  padGain.connect(master)
  ;[110, 110.4, 165].forEach((f, i) => {
    const osc = ctx!.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const g = ctx!.createGain()
    g.gain.value = i === 2 ? 0.25 : 0.6
    osc.connect(g).connect(padGain)
    osc.start()
    nodes.push(osc)
  })

  nodes.push(noise, lfo)
  // gentle 2s fade-in
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2)
  running = true
}

export function stopAmbient() {
  if (!running || !ctx || !master) {
    running = false
    return
  }
  const now = ctx.currentTime
  // gentle 1.2s fade-out, then tear down
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(0, now + 1.2)
  const toStop = nodes
  const oldMaster = master
  setTimeout(() => {
    toStop.forEach((n) => {
      try {
        ;(n as OscillatorNode | AudioBufferSourceNode).stop?.()
      } catch {
        /* already stopped */
      }
      n.disconnect()
    })
    oldMaster.disconnect()
  }, 1300)
  nodes = []
  master = null
  running = false
}

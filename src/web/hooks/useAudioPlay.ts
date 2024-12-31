import { useCallback, useState, useMemo, useEffect } from 'react'
import { mapEntries } from '../../utils/ObjectUtil'

type GlobalContext = {
  isSomePlaying: boolean
}

type Context = {
  isPlaying: boolean
  playbackTime: number
  maxTime: number
  volume: number
  speed: number
}

type InternalContext = {
  absn: AudioBufferSourceNode
  gc: GainNode
}

type Commands = {
  play: () => void
  pause: () => void
  stop: () => void

  setSound: (soundKey: string, uri: string, speed?: number, volume?: number) => Promise<void>
  setSounds: (sounds: { [k: string]: string | [uri: string, speed?: number, volume?: number] }) => Promise<void>
  setVolume: (soundKey: string, volume: number) => void
  setSpeed: (soundKey: string, speed: number) => void
  setPlaybackTime: (soundKey: string, playbackTime: number) => void
}

type AudioState = { [k: string]: InternalContext & Context }
export const useAudioPlay = (): { context: GlobalContext, contexts: { head?: Context } & { [k: string]: Context }, commands: Commands } => {
  const audioContext = useMemo(() => new AudioContext(), [])

  const [audioState, setAudioState] = useState<AudioState>({})

  // MARK: playingWatcher
  const [playingWatcher, setPlayingWatcher] = useState<NodeJS.Timeout>()
  const syncAudioContext = useCallback(() => {
    setAudioState(prev => mapEntries(prev, (ctx) => {
      if (ctx.isPlaying) {
        return { ...ctx, playbackTime: ctx.absn.context.currentTime }
      }
      return ctx
    }))
  }, [setAudioState])
  useEffect(() => {
    if (playingWatcher || Object.values(audioState).every(ctx => !ctx.isPlaying)) return
    const watcher = setInterval(syncAudioContext, 5)
    setPlayingWatcher(watcher)
  }, [audioState, playingWatcher, syncAudioContext])
  useEffect(() => {
    if (playingWatcher && Object.values(audioState).every(ctx => !ctx.isPlaying)) {
      clearInterval(playingWatcher)
      setPlayingWatcher(undefined)
    }
  }, [audioState, playingWatcher, setPlayingWatcher])

  // MARK: play
  const play = useCallback(() => {
    setAudioState((prev) => {
      const newState = mapEntries(prev, ctx => ({ ...ctx, isPlaying: true }))
      Object.entries(newState).forEach(([k, { absn, playbackTime, maxTime }]) => {
        absn.start(0, playbackTime)
        absn.onended = () => {
          setAudioState(prev2 => ({ ...prev2, [k]: { ...prev2[k], isPlaying: false, playbackTime: maxTime } }))
        }
      })
      return newState
    })
  }, [])

  // MARK: pause
  const pause = useCallback(() => {
    setAudioState((prev) => {
      Object.entries(prev).forEach(([, { absn }]) => {
        absn.onended = null
        absn.stop()
      })
      return mapEntries(prev, ctx => ({ ...ctx, isPlaying: false }))
    })
  }, [])

  // MARK: stop
  const stop = useCallback(() => {
    setAudioState((prev) => {
      Object.entries(prev).forEach(([, { absn }]) => {
        absn.onended = null
        absn.stop()
      })
      return mapEntries(prev, ctx => ({ ...ctx, isPlaying: false, playbackTime: 0 }))
    })
  }, [setAudioState])

  // MARK: createAudioContext
  const createAudioContext = useCallback(async (uri: string, speed: number = 1, volume: number = 1): Promise<[AudioBufferSourceNode, GainNode]> => {
    const res = await fetch(uri)
    const buffer = await res.arrayBuffer()

    const audioBuffer = await audioContext.decodeAudioData(buffer)

    const absn = audioContext.createBufferSource()
    absn.buffer = audioBuffer
    absn.playbackRate.value = speed
    absn.connect(audioContext.destination)

    const gainController = audioContext.createGain()
    gainController.gain.value = volume
    gainController.connect(audioContext.destination)

    return [absn, gainController]
  }, [audioContext])

  // MARK: createContext
  const createContext = useCallback((ctx: Pick<Context, 'maxTime'> & Partial<Context>): Context => ({
    isPlaying: false,
    playbackTime: 0,
    volume: 1,
    speed: 1,
    ...ctx,
  }), [])

  // MARK: setSound
  const setSound = useCallback(async (soundKey: string, uri: string, speed: number = 1, volume: number = 1) => {
    stop()
    const [absn, gainController] = await createAudioContext(uri, speed, volume)
    const context = { absn, gc: gainController, ...createContext({ maxTime: absn.buffer!.duration, volume, speed }) }
    setAudioState({ [soundKey]: context })
  }, [createAudioContext, createContext, stop])

  // MARK: setSounds
  const setSounds = useCallback(async (sounds: { [k: string]: string | [uri: string, speed?: number, volume?: number] }) => {
    stop()
    const audioContexts = await Promise.all(Object.entries(sounds).map(async ([k, v]) => {
      const [uri, speed, volume] = Array.isArray(v) ? v : [v]
      const [absn, gainController] = await createAudioContext(uri, speed, volume)
      const context = { absn, gc: gainController, ...createContext({ maxTime: absn.buffer!.duration, volume, speed }) }
      return [k, context]
    }))
    setAudioState(Object.fromEntries(audioContexts))
  }, [createAudioContext, createContext, stop])

  // MARK: setVolume
  const setVolume = useCallback((soundKey: string, volume: number) => {
    setAudioState((prev) => {
      prev[soundKey].gc.gain.value = volume
      return { ...prev, [soundKey]: { ...prev[soundKey], volume } }
    })
  }, [])

  // MARK: setSpeed
  const setSpeed = useCallback((soundKey: string, speed: number) => {
    setAudioState((prev) => {
      prev[soundKey].absn.playbackRate.value = speed
      return { ...prev, [soundKey]: { ...prev[soundKey], speed } }
    })
  }, [])

  // MARK: setPlaybackTime
  const setPlaybackTime = useCallback((soundKey: string, playbackTime: number) => {
    setAudioState((prev) => {
      prev[soundKey].absn.stop()
      return { ...prev, [soundKey]: { ...prev[soundKey], playbackTime } }
    })
  }, [])

  const globalContext = useMemo(() => ({ isSomePlaying: Object.values(audioState).some(ctx => ctx.isPlaying) }), [audioState])

  const contexts = useMemo(() => {
    const head = audioState[Object.keys(audioState)[0]]
    return { head, ...audioState }
  }, [audioState])

  const commands = useMemo(
    () => ({ play, pause, stop, setSound, setSounds, setVolume, setSpeed, setPlaybackTime }),
    [play, pause, stop, setSound, setSounds, setVolume, setSpeed, setPlaybackTime],
  )

  return { context: globalContext, contexts, commands }
}

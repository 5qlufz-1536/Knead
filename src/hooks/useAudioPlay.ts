import { useCallback, useState, useMemo, useEffect } from 'react'
import { mapEntries } from '../utils/ObjectUtil'

type GlobalContext = {
  isSomePlaying: boolean
}

type PlayingContext = {
  isPlaying: true
  absn: AudioBufferSourceNode
  gc: GainNode
}
type StoppingContext = {
  isPlaying: false
}

type Context = (PlayingContext | StoppingContext) & {
  /** 再生時間 */
  playbackTime: number
  /** 最大再生時間 */
  maxTime: number
  /** 音量 */
  volume: number
  /** 再生速度 */
  speed: number
  /** 音声データ */
  buffer: AudioBuffer
  /** 再生開始時刻 */
  playTime: number
  /** 一時停止時刻 */
  pauseTime?: number
}

type PublicContext = Pick<Context, 'isPlaying' | 'playbackTime' | 'maxTime' | 'volume' | 'speed'>

type Commands = {
  play: () => void
  pause: () => void
  stop: () => void
  restart: () => void

  setSound: (soundKey: string, uri: string, speed?: number, volume?: number) => Promise<void>
  setSounds: (sounds: { [k: string]: string | [uri: string, speed?: number, volume?: number] }) => Promise<void>
  setVolume: (soundKey: string, volume: number) => void
  setSpeed: (soundKey: string, speed: number) => void
  setPlaybackTime: (soundKey: string, playbackTime: number) => void
}

type AudioState = { [k: string]: Context }
/**
 * @description
 *  各ステートに対する操作について
 *  - 再生中
 *    - play: 何もしない
 *    - pause: 一時停止
 *    - stop: 停止
 *  - 一時停止中
 *    - play: 再生
 *    - pause: 何もしない
 *    - stop: 停止
 *  - 停止中
 *    - play: 再生
 *    - pause: 何もしない
 *    - stop: 何もしない
 */
export const useAudioPlay = (): { context: GlobalContext, contexts: { head?: PublicContext } & { [k: string]: PublicContext }, commands: Commands } => {
  const audioContext = useMemo(() => new AudioContext(), [])

  const [audioState, setAudioState] = useState<AudioState>({})

  // MARK: playingWatcher
  const [playingWatcher, setPlayingWatcher] = useState<NodeJS.Timeout>()
  const syncAudioContext = useCallback(() => {
    setAudioState(prev => mapEntries(prev, (ctx) => {
      if (ctx.isPlaying) {
        return { ...ctx, playbackTime: (ctx.absn.context.currentTime - ctx.playTime) * ctx.speed }
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

  // MARK: createAudioContext
  const createAudioContext = useCallback((buffer: AudioBuffer, speed: number, volume: number): [AudioBufferSourceNode, GainNode] => {
    const absn = audioContext.createBufferSource()
    absn.buffer = buffer
    absn.playbackRate.value = speed
    absn.connect(audioContext.destination)

    const gainController = audioContext.createGain()
    gainController.connect(audioContext.destination)
    absn.connect(gainController)
    gainController.gain.value = volume

    return [absn, gainController]
  }, [audioContext])

  // MARK: play
  const play = useCallback(() => {
    setAudioState(prev => mapEntries(prev, (ctx, k) => {
      if (ctx.isPlaying) return ctx

      const [absn, gc] = createAudioContext(ctx.buffer, ctx.speed, ctx.volume)
      const playOffset = ctx.playbackTime !== ctx.maxTime ? ctx.playbackTime : 0
      absn.start(0, playOffset)
      absn.onended = () => setAudioState(prev2 => ({ ...prev2, [k]: { ...prev2[k], isPlaying: false, playbackTime: ctx.maxTime } }))
      const playTime = ctx.pauseTime ? ctx.playTime + (absn.context.currentTime - ctx.pauseTime) : absn.context.currentTime
      return { ...ctx, isPlaying: true, absn, gc, playTime, pauseTime: undefined }
    }))
  }, [createAudioContext])

  // MARK: pause
  const pause = useCallback(() => {
    setAudioState(prev => mapEntries(prev, (ctx) => {
      if (!ctx.isPlaying) return ctx

      console.log('pause', ctx)
      ctx.absn.onended = null
      ctx.absn.stop()
      return { ...ctx, isPlaying: false, pauseTime: ctx.absn.context.currentTime }
    }))
  }, [])

  // MARK: stop
  const stop = useCallback(() => {
    setAudioState(prev => mapEntries(prev, (ctx) => {
      if (!ctx.isPlaying) return { ...ctx, playbackTime: 0, playTime: 0, pauseTime: undefined }

      ctx.absn.onended = null
      ctx.absn.stop()
      return { ...ctx, isPlaying: false, playbackTime: 0, playTime: 0, pauseTime: undefined }
    }))
  }, [setAudioState])

  // MARK: restart
  const restart = useCallback(() => {
    setAudioState(prev => mapEntries(prev, (ctx) => {
      if (!ctx.isPlaying) return { ...ctx, playbackTime: 0, playTime: 0, pauseTime: undefined }

      stop()
      play()

      return { ...ctx, isPlaying: true, playTime: 0, pauseTime: ctx.absn.context.currentTime, playbackTime: 0 }
    }))
  }, [stop, play])

  // MARK: createAudioBuffer
  const createAudioBuffer = useCallback(async (uri: string): Promise<AudioBuffer> => {
    const res = await fetch(uri)
    const buffer = await res.arrayBuffer()
    return await audioContext.decodeAudioData(buffer)
  }, [audioContext])

  // MARK: createContext
  const createContext = useCallback((ctx: Pick<Context, 'maxTime' | 'buffer'> & Partial<Omit<Context, 'isPlaying'>>): Context => ({
    isPlaying: false,
    playbackTime: 0,
    volume: 1,
    speed: 1,
    playTime: 0,
    ...ctx,
  }), [])

  // MARK: setSound
  const setSound = useCallback(async (soundKey: string, uri: string, speed: number = 1, volume: number = 1) => {
    stop()
    const buffer = await createAudioBuffer(uri)
    setAudioState({ [soundKey]: createContext({ buffer, maxTime: buffer.duration, volume, speed }) })
  }, [createAudioBuffer, createContext, stop])

  // MARK: setSounds
  const setSounds = useCallback(async (sounds: { [k: string]: string | [uri: string, speed?: number, volume?: number] }) => {
    stop()
    const audioContexts = await Promise.all(Object.entries(sounds).map(async ([k, v]) => {
      const [uri, speed, volume] = Array.isArray(v) ? v : [v]
      const buffer = await createAudioBuffer(uri)
      return [k, createContext({ buffer, maxTime: buffer.duration, volume, speed })]
    }))
    setAudioState(Object.fromEntries(audioContexts))
  }, [createAudioBuffer, createContext, stop])

  // MARK: setVolume
  const setVolume = useCallback((soundKey: string, volume: number) => {
    setAudioState((prev) => {
      if (prev[soundKey].isPlaying) {
        prev[soundKey].gc.gain.value = volume
      }
      return { ...prev, [soundKey]: { ...prev[soundKey], volume } }
    })
  }, [])

  // MARK: setSpeed
  const setSpeed = useCallback((soundKey: string, speed: number) => {
    setAudioState((prev) => {
      const percent = prev[soundKey].playbackTime / prev[soundKey].maxTime
      const playbackTime = (prev[soundKey].maxTime / prev[soundKey].speed) * percent
      if (prev[soundKey].isPlaying) {
        prev[soundKey].absn.playbackRate.value = speed
        // これまで再生してきた時間を考慮してplayTimeが変化するようにする
        console.log(playbackTime)
        prev[soundKey].playTime = prev[soundKey].absn.context.currentTime - Math.abs(playbackTime)
      }
      else {
        prev[soundKey].playTime -= Math.abs(playbackTime)
        if (prev[soundKey].pauseTime) prev[soundKey].pauseTime -= Math.abs(playbackTime)
      }
      return { ...prev, [soundKey]: { ...prev[soundKey], speed } }
    })
  }, [])

  // MARK: setPlaybackTime
  const setPlaybackTime = useCallback((soundKey: string, playbackTime: number) => {
    setAudioState((prev) => {
      if (prev[soundKey].isPlaying) {
        // いろいろ試したけどこれが一番思ってる挙動する 謎
        const playTime = prev[soundKey].absn.context.currentTime - (playbackTime / (prev[soundKey].speed < 1 ? prev[soundKey].speed : 1))
        pause()
        // ここで少しだけ待ってもらうような処理書いたほうがバグ発生抑えれる？ でも待つ処理がわからん
        play()
        return { ...prev, [soundKey]: { ...prev[soundKey], playTime, pauseTime: 0, playbackTime } }
      }

      return { ...prev, [soundKey]: { ...prev[soundKey], playTime: 0, pauseTime: playbackTime, playbackTime } }
    })
  }, [pause, play])

  const globalContext = useMemo(() => ({ isSomePlaying: Object.values(audioState).some(ctx => ctx.isPlaying) }), [audioState])

  const contexts = useMemo(() => {
    const head = audioState[Object.keys(audioState)[0]]
    return { head, ...audioState }
  }, [audioState])

  const commands = useMemo(
    () => ({ play, pause, stop, restart, setSound, setSounds, setVolume, setSpeed, setPlaybackTime }),
    [play, pause, stop, restart, setSound, setSounds, setVolume, setSpeed, setPlaybackTime],
  )

  return { context: globalContext, contexts, commands }
}

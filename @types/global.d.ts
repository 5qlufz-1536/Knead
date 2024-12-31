import { Sound } from '../src/store/fetchSlice'

declare global {
  interface Window {
    myAPI: Sandbox
  }
}

export interface Sandbox {
  get_versions: () => Promise<string[]>
  get_mcSounds: (version: string) => Promise<Sound[]>
  get_mcSoundHash: (hash: string) => Promise<string>
  save: (Volume: string, SoundRatings: string, TargetVersion: string) => Promise<void>
}

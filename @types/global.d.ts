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
  make_sub_window: () => void
  loadSettings: () => Promise<any>
  updateSettings: (partial: Record<string, any>) => void
  getSetting: <Key extends string>(key: Key) => Promise<any>;
  setSetting: <Key extends string>(key: Key, value: any) => void;
  loadRatingStar: () => Promise<{ [key: string]: number }>;
  saveRatingStar: (data: string) => Promise<void>;
  saveRatingStarAsString: (data: string) => Promise<void>;
  updateRatingStar: (key: string, value: number) => Promise<void>;
}

import { Sound, SoundName } from "../src/store/fetchSlice";
import { VersionInfoType } from "../src/types/VersionInfo";

declare global {
    interface Window {
        myAPI: Sandbox;
    }
}

export interface Sandbox {
    get_versions: () => Promise<string[]>;
    get_mcSounds: (version: string) => Promise<Sound[]>;
    get_mcSoundHash: (hash: string) => Promise<string>;
}
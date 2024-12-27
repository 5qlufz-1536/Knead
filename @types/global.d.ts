import { Sound } from "../src/store/fetchSlice";

declare global {
    interface Window {
        myAPI: Sandbox;
    }
}

export interface Sandbox {
    readdirSync: (str: string) => Promise<string[]>;
    appdata: () => Promise<string>;
    get_mcSounds: (str: string) => Promise<Sound[]>;
}
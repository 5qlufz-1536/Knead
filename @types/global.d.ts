declare global {
    interface Window {
        myAPI: Sandbox;
    }
}

export interface Sandbox {
    readdirSync: (str: string) => Promise<string[]>;
    appdata: () => Promise<string>;
}
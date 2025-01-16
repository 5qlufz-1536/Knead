import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export interface KneadSettings {
    volume: number;
    language: string;
    theme: string;
    selectedVersion: string;
    playbackCategory: string;
    [key: string]: string | number | undefined;
}

export const defaultSettings: KneadSettings = {
    volume: 0.5,
    language: 'en',
    theme: 'dark',
    selectedVersion: '1.21.4',
    playbackCategory: 'master',
};

/**
 * Electron のユーザーデータフォルダに置く設定ファイル
 * 例: Windows -> C:\Users\<User>\AppData\Roaming\knead\settings.json
 */
const configPath = path.join(app.getPath('userData'), 'settings.json');

/**
 * 設定ファイルを読み込む関数
 */
export function loadSettings(): KneadSettings {
    try {
        if (!fs.existsSync(configPath)) {
        // ファイルがなければデフォルトを書き込み
        console.log('default settings')
        fs.writeFileSync(configPath, JSON.stringify(defaultSettings, null, 2));
        return defaultSettings;
        }
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<KneadSettings>;
    return {
        ...defaultSettings,
        ...parsed,
    } as KneadSettings;
    } catch (err) {
    console.error('[loadSettings] Failed:', err);
    return defaultSettings;
    }
}

/**
 * 指定されたキーの値を取得する関数
 */
export function getSetting<Key extends keyof KneadSettings>(key: Key): KneadSettings[Key] {
    const settings = loadSettings();
    return settings[key];
}

/**
 * 設定ファイルに指定されたキーの値を書き込む関数
 */
export function setSetting<Key extends keyof KneadSettings>(key: Key, value: KneadSettings[Key]): void {
    const settings = loadSettings();
    settings[key] = value;
    try {
        fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
    } catch (err) {
        console.error('[setSetting] Failed:', err);
    }
}

/**
 * 設定ファイルに書き込む関数
 */
export function saveSettings(settings: KneadSettings) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
    } catch (err) {
    console.error('[saveSettings] Failed:', err);
    }
}
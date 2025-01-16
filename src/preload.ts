console.log('preloaded!')

import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('myAPI', {
  get_versions: () => ipcRenderer.invoke('get_versions'),
  get_mcSounds: (version: string) => ipcRenderer.invoke('get_mcSounds', version),
  get_mcSoundHash: (hash: string) => ipcRenderer.invoke('get_mcSoundHash', hash),
  make_sub_window: () => ipcRenderer.invoke('make_sub_window'),
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  updateSettings: (partial: any) => ipcRenderer.send('settings:update', partial),
  getSetting: (key: string): Promise<any> => ipcRenderer.invoke('settings:get', key),
  setSetting: (key: string, value: any) => ipcRenderer.send('settings:set', { key, value })
})

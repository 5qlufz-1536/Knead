console.log('preloaded!')

import { ipcRenderer, contextBridge } from 'electron'
import { Sound } from './store/fetchSlice'

contextBridge.exposeInMainWorld('myAPI', {
  get_versions: () => ipcRenderer.invoke('get_versions'),
  get_mcSounds: (version: string) => ipcRenderer.invoke('get_mcSounds', version),
  get_mcSoundHash: (hash: string) => ipcRenderer.invoke('get_mcSoundHash', hash),
  save: (str: string) => ipcRenderer.invoke('save', str),
})

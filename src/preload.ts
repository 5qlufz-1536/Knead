console.log("preloaded!");

import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
  get_versions: (str: string) => ipcRenderer.invoke("get_versions", str),
  get_mcSounds: (str: string) => ipcRenderer.invoke("get_mcSounds", str),
  save: (str: string) => ipcRenderer.invoke("save", str),
});
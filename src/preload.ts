console.log("preloaded!");

import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
  readdirSync: (str: string) => ipcRenderer.invoke("readdirSync", str),
  appdata: () => ipcRenderer.invoke("appdata"),
  save: (str: string) => ipcRenderer.invoke("save", str),
});
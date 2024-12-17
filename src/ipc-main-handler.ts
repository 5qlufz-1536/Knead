import { ipcMain } from "electron";
import * as fs from "fs";

export const initIpcMain = (): void => {
  ipcMain.handle("readdirSync", async (event, str: any) => {
    return fs.readdirSync(str)
  });
  ipcMain.handle("appdata", (event) => {
    return process.env.APPDATA
  });
  ipcMain.handle("save", (event, str: string) => {
    console.log(`save: ${str}`);
  });
};



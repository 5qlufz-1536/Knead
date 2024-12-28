import { Dict } from "@yamada-ui/react";
import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import { SoundName, Sound } from "./store/fetchSlice";
import { VersionInfoType } from "./types/VersionInfo";

const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
}

type SoundsJson = {
  [key: string]: {
    sounds: (string | { name: string, pitch?: number, volume?: number, attenuation_distance?: number, type?: string })[]
    subtitle?: string
  }
}

const getHashBySoundName = (hashMap: { [key: string]: { hash: string } }, soundName: string): string => {
  return hashMap[`minecraft/sounds/${soundName}.ogg`].hash
    ?? hashMap[`sounds/${soundName}.ogg`].hash
    ?? hashMap[`sound/${soundName}.ogg`].hash
    ?? ""
}

export const initIpcMain = (): void => {
  ipcMain.handle("get_versions", async (event) => {
    return fs.readdirSync(path.join(process.env.APPDATA!, '.minecraft', 'versions'))
  });

  ipcMain.handle("get_mcSounds", async (event, version: string) => {
    const assetIndex: string = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA!, '.minecraft', 'versions', version, `${version}.json`)).toString()).assetIndex.id
    const objects: Dict = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA!, '.minecraft', 'assets', 'indexes', `${assetIndex}.json`)).toString()).objects

    // sounds.jsonの中身
    const soundsJsonHash = objects[Object.keys(objects).filter((key) => /sounds.json$/.test(key))[0]].hash
    const soundsJsonPath = path.join(process.env.APPDATA!, '.minecraft', 'assets', 'objects', soundsJsonHash.slice(0, 2), soundsJsonHash)
    const soundsJson = JSON.parse(fs.readFileSync(soundsJsonPath).toString()) as SoundsJson

    const result: Sound[] = [];

    for (const id of Object.keys(soundsJson)) {
      const sound: Sound = { id, sounds: [] }

      for (const element of soundsJson[id].sounds) {
        if (typeof element == "string") {
          sound.sounds.push({ hash: getHashBySoundName(objects, element), pitch: 1 })
        } else if (element.type != null && element.type == "event") {
          const pitch: number = element?.pitch ?? 1

          for (const element2 of soundsJson[element.name].sounds) {
            if (typeof element2 == "string") {
              sound.sounds.push({ hash: getHashBySoundName(objects, element2), pitch })
            } else {
              sound.sounds.push({ hash: getHashBySoundName(objects, element2.name), pitch: element2?.pitch ?? 1 })
            }
          }
        } else {
          sound.sounds.push({ hash: getHashBySoundName(objects, element.name), pitch: element?.pitch ?? 1 })
        }
      }

      result.push(sound)
    }


    return result
  });



  ipcMain.handle("save", (event, str: string) => {
    console.log(`save: ${str}`);
  });
};



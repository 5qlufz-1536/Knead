import { Dict } from "@yamada-ui/react";
import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import { SoundName, Sound } from "./store/fetchSlice";



export const initIpcMain = (): void => {
  ipcMain.handle("readdirSync", async (event, str: any) => {
    return fs.readdirSync(str)
  });
  ipcMain.handle("appdata", (event) => {
    return process.env.APPDATA
  });
  ipcMain.handle("get_mcSounds", async (event, str: string) => {
    var assetIndex: string = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA + '\\.minecraft\\versions\\' + str + "\\" + str + ".json")).toString()).assetIndex.id
    var objects: Dict = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA + '\\.minecraft\\assets\\indexes\\' + assetIndex + ".json")).toString()).objects
    // sounds.jsonの中身
    var sounds_json: Dict = {}

    var result: Sound[] = [];
    for (var key of Object.keys(objects)) {
      if (/sounds.json$/.test(key)) {
        sounds_json = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA + '\\.minecraft\\assets\\objects\\' + objects[key].hash.slice(0, 2) + "\\" + objects[key].hash)).toString())
        break;
      }
    }

    for (var id of Object.keys(sounds_json)) {
      var sound: Sound = { id: "", sounds: [], rating: 3 }
      sound.id = id
      sounds_json[id].sounds.forEach((element: any) => {
        var hash: string = ""
        var volume: number = 1
        var pitch: number = 1
        if (typeof element == "string") {
          hash = objects["minecraft/sounds/" + element + ".ogg"].hash
          sound.sounds.push({hash: hash, volume: volume, pitch: pitch})
        }
        else if (element.type != null && element.type == "event") {
          if (element.volume != null) volume = element.volume > 2 ? 2 : element.volume
          if (element.pitch != null) pitch = element.pitch
          sounds_json[element.name].sounds.forEach((element2: any) => {
            var hash_tmp: string = ""
            var volume_tmp: number = 1
            var pitch_tmp: number = 1
            if (typeof element2 == "string") {
              hash_tmp = objects["minecraft/sounds/" + element2 + ".ogg"].hash
            }
            else {
              hash_tmp = objects["minecraft/sounds/" + element2.name + ".ogg"].hash
              if (element2.volume != null) volume_tmp = element2.volume > 2 ? 2 : element2.volume
              if (element2.pitch != null) pitch_tmp = element2.pitch
            }
            volume_tmp *= volume
            pitch_tmp *= pitch
            sound.sounds.push({hash: hash_tmp, volume: volume_tmp, pitch: pitch_tmp})
          })
        }
        else {
          hash = objects["minecraft/sounds/" + element.name + ".ogg"].hash
          if (element.volume != null) volume = element.volume > 2 ? 2 : element.volume
          if (element.pitch != null) pitch = element.pitch
          sound.sounds.push({hash: hash, volume: volume, pitch: pitch})
        }
      });
      result.push(sound)
    }


    return result
  });
  ipcMain.handle("save", (event, str: string) => {
    console.log(`save: ${str}`);
  });
};



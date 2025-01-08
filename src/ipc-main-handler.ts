import { Dict } from '@yamada-ui/react'
import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { Sound } from './store/fetchSlice'

const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max)
}

const getMinecraftDir = () => {
  let dir: string[] = []
  const os = process.platform

  switch (os) {
    case 'win32':
      dir = [process.env.APPDATA!, '.minecraft']
      break
    case 'darwin':
      dir = [process.env.HOME!, 'Library', 'Application Support', 'minecraft']
      break
    case 'linux':
      dir = [process.env.HOME!, '.minecraft']
      break
    default:
      break
  }

  return dir
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
    ?? ''
}

export const initIpcMain = (): void => {
  ipcMain.handle('get_versions', async () => {
    const folders = fs.readdirSync(path.join(...getMinecraftDir(), 'versions')).filter((e) => {
      return fs.statSync(path.join(...getMinecraftDir(), 'versions', e)).isDirectory()
    }).filter((e) => {
      return fs.readdirSync(path.join(...getMinecraftDir(), 'versions', e)).filter((e) => {
        return /.*\.json$/.test(e)
      }).length > 0
    })
    return folders
  })

  ipcMain.handle('get_mcSounds', async (event, version: string) => {
    const assetIndex: string = JSON.parse(fs.readFileSync(path.join(...getMinecraftDir(), 'versions', version, `${version}.json`)).toString()).assetIndex.id
    const objects: Dict = JSON.parse(fs.readFileSync(path.join(...getMinecraftDir(), 'assets', 'indexes', `${assetIndex}.json`)).toString()).objects

    // sounds.jsonの中身
    const soundsJsonHash = objects[Object.keys(objects).filter(key => /sounds.json$/.test(key))[0]].hash
    const soundsJsonPath = path.join(...getMinecraftDir(), 'assets', 'objects', soundsJsonHash.slice(0, 2), soundsJsonHash)
    const soundsJson = JSON.parse(fs.readFileSync(soundsJsonPath).toString()) as SoundsJson

    const result: Sound[] = []

    for (const id of Object.keys(soundsJson)) {
      const sound: Sound = { id, sounds: [] }

      for (const element of soundsJson[id].sounds) {
        if (typeof element == 'string') {
          sound.sounds.push({ hash: getHashBySoundName(objects, element), pitch: 1 })
        }
        else if (element.type != null && element.type == 'event') {
          const pitch: number = element?.pitch ?? 1

          for (const element2 of soundsJson[element.name].sounds) {
            if (typeof element2 == 'string') {
              sound.sounds.push({ hash: getHashBySoundName(objects, element2), pitch })
            }
            else {
              sound.sounds.push({ hash: getHashBySoundName(objects, element2.name), pitch: clamp((element2?.pitch ?? 1) * (element?.pitch ?? 1), 0.5, 2) })
            }
          }
        }
        else {
          sound.sounds.push({ hash: getHashBySoundName(objects, element.name), pitch: element?.pitch ?? 1 })
        }
      }

      result.push(sound)
    }

    return result
  })

  ipcMain.handle('get_mcSoundHash', async (event, hash: string): Promise<string> => {
    const file = hash === '' ? '' : path.join(...getMinecraftDir(), 'assets', 'objects', hash.slice(0, 2), hash)
    return file
  })
}

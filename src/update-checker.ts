import { app, dialog, BrowserWindow } from 'electron'
import log from 'electron-log'
import { download } from 'electron-dl'
import path from 'path'
import { spawn } from 'child_process'
import fs from 'fs'
import { getSetting } from './config'
import { compareVersions, getUpdaterExecutableName } from './utils/UpdateUtil'
import { getThemeStyles, createProgressWindow, updateProgressUI, showErrorUI, appendLogUI } from './utils/uiHelper'
import { getUpdaterTexts } from './web/i18n/updaterTexts'

interface ReleaseAsset {
  name: string
  browser_download_url: string
}

interface ReleaseInfo {
  tag_name: string
  assets: ReleaseAsset[]
}

export const initAutoUpdateChecker = async () => {
  const currentVersion = app.getVersion()
  log.info('[Updater] Current version:', currentVersion)
  // 言語設定を取得
  const lang = await getSetting('language')
  const themeSettings = await getSetting('theme') as 'system' | 'dark' | 'light'
  const texts = getUpdaterTexts(lang)
  const colors = getThemeStyles(themeSettings)
  const exeDir = path.dirname(process.execPath)

  try {
    // OSごとの実行ファイルを想定
    const updaterExeName = getUpdaterExecutableName()
    if (!updaterExeName) {
      // 未対応OSの場合
      log.warn(`[Updater] This platform (${process.platform}) is not supported by the updater.`)
      return
    }
    const updaterPath = path.join(exeDir, updaterExeName)

    // 最新リリース情報を取得
    const response = await fetch('https://api.github.com/repos/nea-c/Knead/releases/latest')
    if (!response.ok) {
      throw new Error(`Failed to fetch release info: ${response.status}`)
    }
    const release = await response.json()
    const latestVersion = release.tag_name.replace(/^v/, '')
    log.info('[Updater] Latest version:', latestVersion)

    // バージョン比較
    if (compareVersions(currentVersion, latestVersion) < 0) {
      const mainWin = BrowserWindow.getAllWindows()[0]
      if (!mainWin) {
        log.warn('[Updater] No active BrowserWindow found to show dialog.')
        return
      }
      const result = await dialog.showMessageBox(mainWin, {
        type: 'info',
        title: texts.title,
        message: texts.message.replace('{latest}', latestVersion).replace('{current}', currentVersion),
        buttons: texts.buttons,
        defaultId: 0,
      })

      // アップデーターが存在するかをチェック
      if (!fs.existsSync(updaterPath)) {
        if (result.response === 0) {
          log.error(`[Updater] Updater not found: ${updaterPath}`)
          dialog.showErrorBox(texts.errorTitle, texts.notfoundUpdater + ': ' + updaterPath)
        }
        return
      }

      if (result.response === 0) {
        // ZIPアセットを探す
        if (!Array.isArray(release.assets)) {
          throw new Error('No assets in the latest release')
        }
        const zipAsset = release.assets.find((asset: ReleaseAsset) => asset.name.endsWith('.zip'))
        if (!zipAsset) {
          throw new Error('No .zip asset found in the latest release')
        }

        // ダウンロード先を exe と同じフォルダに
        const zipPath = path.join(exeDir, zipAsset.name)

        // 進捗表示ウィンドウ作成
        const progressWin = await createProgressWindow(texts.progressTitle, colors, exeDir)

        try {
          log.info('[Updater] Start downloading ZIP:', zipAsset.browser_download_url)
          appendLogUI(progressWin, `Downloading: ${zipAsset.browser_download_url}`).catch(console.error)

          // ダウンロード処理
          await download(mainWin, zipAsset.browser_download_url, {
            directory: exeDir,
            filename: zipAsset.name,
            onProgress: (progress) => {
              const percent = Math.round(progress.percent * 100)
              updateProgressUI(progressWin, percent).catch(console.error)
            },
          })
          log.info('[Updater] Download complete:', zipPath)
          appendLogUI(progressWin, 'Download complete.').catch(console.error)

          // アップデーター起動前UI更新
          if (!progressWin.isDestroyed()) {
            progressWin.webContents.executeJavaScript(`
              document.getElementById('title').textContent = '${texts.launchingUpdater}';
            `)
          }
          if (!fs.existsSync(updaterPath)) {
            throw new Error(`Updater not found: ${updaterPath}`)
          }

          // アップデーター起動
          const cmd = `"${updaterPath}" --zip "${zipPath}" --appExe "${process.execPath}" --called-from-parent`
          log.info('[Updater] Spawning updater with command:', cmd)
          const child = spawn(cmd, {
            cwd: exeDir,
            shell: true,
            detached: true,
            stdio: 'ignore',
          })
          child.on('error', (err) => {
            log.error('[Updater] spawn error:', err)
            appendLogUI(progressWin, `Spawn error: ${err.message}`).catch(console.error)
            showErrorUI(progressWin, `spawn error: ${err.message}`).catch(console.error)
          })
          child.on('spawn', () => {
            log.info('[Updater] Knead-Updater.exe process spawned successfully.')
            appendLogUI(progressWin, 'Knead-Updater.exe spawned successfully.').catch(console.error)
          })

          // 数秒後にメインアプリを終了
          setTimeout(() => {
            if (!progressWin.isDestroyed()) {
              progressWin.close()
            }
            app.quit()
          }, 3000)
        }
        catch (downloadErr: unknown) {
          const message = downloadErr instanceof Error ? downloadErr.message : String(downloadErr)
          log.error('[Updater] Download or spawn error:', downloadErr)
          appendLogUI(progressWin, `Updater error: ${message}`).catch(console.error)
        }
      }
    }
    else {
      log.info('[Updater] You are on the latest version')
    }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    log.error('[Updater] Overall update check error:', error)
    dialog.showErrorBox(texts.errorTitle, message)
  }
}

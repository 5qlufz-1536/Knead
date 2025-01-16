import path from 'node:path'
import { BrowserWindow, app, ipcMain } from 'electron'
import { initIpcMain } from './ipc-main-handler'
import { loadSettings, saveSettings } from './config'

initIpcMain()

app.whenReady().then(() => {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 790 + 40,
    minWidth: 650,
    minHeight: 650,
    frame: true,
    center: true,
    title: 'Knead',
    opacity: 1,
    show: false,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      // webpack が出力したプリロードスクリプトを読み込み
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  // メニューバー削除
  mainWindow.setMenu(null)

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html')
  if (process.env.NODE_ENV == 'development') mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // サブウインドウを作成するハンドラ
  ipcMain.handle('make_sub_window', (): void => {
    // 子ウィンドウを作成
    const subWindow = new BrowserWindow({
      width: 950,
      height: 650 + 40,
      minWidth: 650,
      minHeight: 650,
      frame: true,
      title: 'Knead',
      parent: mainWindow,
      opacity: 1,
      show: false,
      icon: path.join(__dirname, 'assets/icon.png'),
    })
    // メニューバー削除
    subWindow.setMenu(null)
    // 子ウィンドウ用 HTML
    subWindow.loadFile('dist/index.html', { hash: 'sub' })
    if (process.env.NODE_ENV == 'development') subWindow.webContents.openDevTools()

    subWindow.once('ready-to-show', () => {
      subWindow.show()
    })
  })
})

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit())

//設定を読み込む (例: レンダラープロセスが invoke したら返す)
ipcMain.handle('settings:load', async () => {
  return loadSettings();
});

//設定を更新する (例: レンダラープロセスが send したら保存)
ipcMain.on('settings:update', (event, partialSettings) => {
  const current = loadSettings();
  const updated = { ...current, ...partialSettings };
  saveSettings(updated);
});

// 特定のキーの設定値を取得
ipcMain.handle('settings:get', (event, key: string) => {
  const settings = loadSettings();
  return settings[key] ?? null;
});

// 特定のキーの設定値を更新
ipcMain.on('settings:set', (event, { key, value }) => {
  const settings = loadSettings();
  settings[key] = value;
  console.log(`Updated setting: ${key} = ${value}`);
});

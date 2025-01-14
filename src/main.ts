import path from 'node:path'
import { BrowserWindow, app, ipcMain } from 'electron'
import { initIpcMain } from './ipc-main-handler'

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
      icon: path.join(__dirname, 'assets/icon.png'),
    })
    // メニューバー削除
    subWindow.setMenu(null)
    // 子ウィンドウ用 HTML
    subWindow.loadFile('dist/index.html', { hash: 'sub' })
  })
})

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit())

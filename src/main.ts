import path from "node:path";
import { BrowserWindow, app } from "electron";

app.whenReady().then(() => {
    // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 640,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "assets/icon.png"),
        webPreferences: {
            // webpack が出力したプリロードスクリプトを読み込み
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // レンダラープロセスをロード
    mainWindow.loadFile("dist/index.html");
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once("window-all-closed", () => app.quit());
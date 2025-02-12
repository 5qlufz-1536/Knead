import { BrowserWindow, nativeTheme } from 'electron';
import fs from 'fs';
import path from 'path';

export interface ThemeStyles {
    background: string;
    text: string;
    border: string;
    progressBg: string;
    logAreaBg: string;
}

export function getThemeStyles(theme: 'system' | 'dark' | 'light'): ThemeStyles {
    if (theme === 'system') {
            theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    }
    const styles: Record<'dark' | 'light', ThemeStyles> = {
        dark: {
        background: '#1e1e1e',
        text: '#ffffff',
        border: '#404040',
        progressBg: '#2d2d2d',
        logAreaBg: '#2d2d2d'
        },
        light: {
        background: '#ffffff',
        text: '#000000',
        border: '#cccccc',
        progressBg: '#f0f0f0',
        logAreaBg: '#f9f9f9'
        }
    };
    return styles[theme];
}

export async function createProgressWindow(
        title: string,
        colors: ThemeStyles,
        exeDir: string
    ): Promise<BrowserWindow> {
    const progressWin = new BrowserWindow({
        width: 500,
        height: 280,
        title,
        center: true,
        resizable: false,
        modal: true,
        autoHideMenuBar: true,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const progressHtml = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>${title}</title>
            <style>
            body {
                background: ${colors.background};
                color: ${colors.text};
                margin: 10px;
                font-family: sans-serif;
            }
            #title { font-weight: bold; font-size: 1.1rem; margin-bottom: 10px; }
            progress { width: 100%; height: 20px; }
            #message { margin: 5px 0; }
            #error { color: red; margin-top: 8px; white-space: pre-wrap; }
            #logarea {
                margin-top: 15px; padding: 5px; border: 1px solid ${colors.border};
                height: 100px; overflow: auto; font-size: 0.85rem; white-space: pre-wrap;
                background: ${colors.logAreaBg};
            }
            </style>
        </head>
        <body>
            <div id="title">${title}</div>
            <progress id="progress" value="0" max="100"></progress>
            <div id="message">0%</div>
            <div id="error"></div>
            <div id="logarea"></div>
        </body>
    </html>
    `;
    const tempHtmlPath = path.join(exeDir, `update_progress_${Date.now()}.html`);
    fs.writeFileSync(tempHtmlPath, progressHtml, 'utf-8');
    await progressWin.loadFile(tempHtmlPath);
    progressWin.once('ready-to-show', () => {
        progressWin.show();
        if (fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath);
        }
    });
    return progressWin;
}

export async function updateProgressUI(win: BrowserWindow, percent: number): Promise<void> {
    if (!win.isDestroyed()) {
        await win.webContents.executeJavaScript(`
            document.getElementById('progress').value = ${percent};
            document.getElementById('message').textContent = '${percent}%';
        `);
    }
}

export async function showErrorUI(win: BrowserWindow, errorMessage: string): Promise<void> {
    if (!win.isDestroyed()) {
        await win.webContents.executeJavaScript(`
        document.getElementById('error').textContent = '${errorMessage.replace(/'/g, "\\'")}';
        `);
    }
}

export async function appendLogUI(win: BrowserWindow, msg: string): Promise<void> {
    if (!win.isDestroyed()) {
        await win.webContents.executeJavaScript(`
        const logArea = document.getElementById('logarea');
        logArea.textContent += '\\n${msg.replace(/'/g, "\\'")}';
        logArea.scrollTop = logArea.scrollHeight;
        `);
    }
}

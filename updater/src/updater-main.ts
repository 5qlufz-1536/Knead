import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import AdmZip from 'adm-zip';

// 引数解析
function parseArgs() {
    const args = process.argv.slice(2);
    const result: { zip?: string; appExe?: string } = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--zip') {
        result.zip = args[i + 1];
        } else if (arg === '--appExe') {
        result.appExe = args[i + 1];
        }
    }
    return result;
}


async function main() {
    // 直接的なアップデーターの起動を禁止
    if (!process.argv.includes('--called-from-parent')) {
        console.error('直接の起動は禁止されています。');
        process.exit(1);
    }

    const exeDir = path.dirname(process.execPath);
    console.log('[Updater] exeDir:', exeDir);

    const { zip: zipPathArg, appExe } = parseArgs();
    if (!zipPathArg || !appExe) {
        console.error('[Updater] Error: Missing --zip or --appExe argument.');
        process.exit(1);
    }

    const zipPath = path.resolve(zipPathArg);
    console.log('[Updater] ZIP path:', zipPath);
    console.log('[Updater] Target appExe:', appExe);

    // メインアプリが終了するのを待機 (最大30秒程度試す)
    const isAppClosed = await waitForAppToClose(appExe, 30000);
    if (!isAppClosed) {
        console.error('[Updater] Main app did not close in time. Exiting.');
        process.exit(1);
    }

    // backupフォルダの作成（既にあれば使う）
    const backupDir = path.join(exeDir, 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
        console.log('[Updater] Created backup folder:', backupDir);
    }

    // exeDir 内のファイルをバックアップへ移動 (除外対象はスキップ)
    //   - zipファイル, backupフォルダ, Knead-Updater.exe, userData 等
    const items = fs.readdirSync(exeDir);
    const updaterExeName = path.basename(process.execPath);
    for (const item of items) {
        // スキップ判定
        if (item === path.basename(zipPath)) continue;
        if (item === path.basename(backupDir)) continue;
        if (item === updaterExeName) continue;
        if (item === 'userData') continue;

        const srcPath = path.join(exeDir, item);
        const dstPath = path.join(backupDir, item);
        try {
        fs.renameSync(srcPath, dstPath);
        console.log(`[Updater] Moved "${item}" -> backup folder`);
        } catch (err) {
        console.error(`[Updater] Failed to move "${item}" to backup:`, err);
        }
    }

    // ZIPファイルを解凍
    if (!fs.existsSync(zipPath)) {
        console.error('[Updater] ZIP file does not exist:', zipPath);
        process.exit(1);
    }
    console.log('[Updater] Unzipping:', zipPath);
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(exeDir, true);
    console.log('[Updater] Unzip complete. Files extracted to:', exeDir);

    //zipを削除
    try {
        fs.unlinkSync(zipPath);
        console.log('[Updater] Removed ZIP file:', zipPath);
    } catch (err) {
        console.warn('[Updater] Failed to remove ZIP file:', err);
    }

    // 新しいアプリを起動(OSによって違う)
    const newExePath = path.join(exeDir, 'Knead.exe');
    if (fs.existsSync(newExePath)) {
        console.log('[Updater] Launching new exe:', newExePath);
        spawn(newExePath, [], { detached: true, stdio: 'ignore' });
    } else {
        console.warn('[Updater] New exe not found:', newExePath);
    }

    // アップデーターを終了
    console.log('[Updater] Update process done. Exiting updater.');
    process.exit(0);
}

// メインアプリが終了したかをチェックする関数
// 「ファイルに書き込みロックができるか」で判定
async function waitForAppToClose(appExePath: string, timeoutMs: number): Promise<boolean> {
    const start = Date.now();
    const intervalMs = 1000;

    while (Date.now() - start < timeoutMs) {
        if (canOpenForWrite(appExePath)) {
        // 書き込みできたら、アプリは閉じたとみなす
        return true;
        }
        await sleep(intervalMs);
    }
    return false;
}

/** 指定ファイルを排他モードで開けるかどうか (Windows) */
function canOpenForWrite(filePath: string): boolean {
    try {
        const fd = fs.openSync(filePath, 'r+'); // 読み書きモードで開く
        fs.closeSync(fd);
        return true;
    } catch (err: any) {
        // 開けなかったらfalse
        return false;
    }
}

/** 指定ミリ秒待つ */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 実行
main().catch(err => {
    console.error('[Updater] Fatal error in updater:', err);
    process.exit(1);
});
export function compareVersions(v1: string, v2: string): number {
    const toNums = (v: string) => v.split('.').map(n => parseInt(n, 10))
    const a = toNums(v1), b = toNums(v2)
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const diff = (a[i] || 0) - (b[i] || 0)
        if (diff !== 0) return diff
    }
    return 0
}

export function getUpdaterExecutableName(): string {
    switch (process.platform) {
        case 'win32':
        return 'Knead-Updater.exe'
        case 'darwin':
        return 'Knead-Updater-macos' // 仮
        case 'linux':
        return 'Knead-Updater-linux' // 仮
        default:
        return ''
    }
}

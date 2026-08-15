export const footerConfig = {
    repoLabel: 'silverfankw/kmb-dpip @ 2026',
    repoUrl: 'https://github.com/silverfankw/kmb-dpip',
    versionHistoryLabel: '版本歷史',
    keyboardShortcutLabel: '鍵盤快捷鍵',
    note: '建議使用 16:9 螢幕瀏覽以獲得最佳體驗。本工具為非官方開發之娛樂項目，僅供個人體驗與參考。',
    legal: '開發者不保證內容之準確性與服務穩定性，亦不對使用本工具所產生之任何損害承擔責任。',
    shortcuts: [
        { keys: ['←'], label: '上一站' },
        { keys: ['→'], label: '下一站' },
        { keys: ['END'], label: '轉換路線方向' },
        { keys: ['HOME'], label: '由首站開始' },
    ],
    modeToggle: {
        light: '切換夜間模式',
        night: '切換日間模式',
    },
}

export const versionHistoryDialogConfig = {
    title: '版本歷史',
    cancel: '取消',
    empty: 'No previous history available.',
}

export const errorMessageConfig = {
    fallback: 'An unexpected error occurred. Please try again.',
    refresh: 'Refresh Page',
}

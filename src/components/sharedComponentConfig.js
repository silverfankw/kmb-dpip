export const footerConfig = {
    zh: {
        repoLabel: 'silverfankw/kmb-dpip @ 2026',
        repoUrl: 'https://github.com/silverfankw/kmb-dpip',
        versionHistoryLabel: '版本歷史',
        keyboardShortcutLabel: '鍵盤快捷鍵',
        note: '建議使用 16:9 螢幕瀏覽以獲得最佳體驗。 本工具為非官方開發之娛樂項目，僅供個人體驗與參考。',
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
        languageToggle: {
            zh: '繁中',
            en: 'English',
        },
        languageSwitchTooltip: {
            zh: '切換為英文',
            en: 'Switch to English',
        },
    },
    en: {
        repoLabel: 'silverfankw/kmb-dpip @ 2026',
        repoUrl: 'https://github.com/silverfankw/kmb-dpip',
        versionHistoryLabel: 'Version history',
        keyboardShortcutLabel: 'Keyboard shortcuts',
        note: 'Optimized for 16:9 displays. An independent, non-commercial tool for personal entertainment only.',
        legal: 'Provided "as is" without warranty of accuracy or availability. The developer accepts no liability for any damages arising from use.',
        shortcuts: [
            { keys: ['←'], label: 'Previous stop' },
            { keys: ['→'], label: 'Next stop' },
            { keys: ['END'], label: 'Switch route direction' },
            { keys: ['HOME'], label: 'Start from first stop' },
        ],
        modeToggle: {
            light: 'Switch to night mode',
            night: 'Switch to day mode',
        },
        languageToggle: {
            zh: '繁中',
            en: 'English',
        },
        languageSwitchTooltip: {
            zh: '切換為繁中',
            en: 'Switch to Traditional Chinese',
        },
    },
}

export const getFooterConfig = (language = 'zh') => footerConfig[language === 'en' ? 'en' : 'zh']

export const appTextConfig = {
    zh: {
        routeLabel: '路線',
        stopCountLabel: '站數',
        currentStopLabel: '本站',
        prevStop: '上一站',
        nextStop: '下一站',
        switchDirection: '切換方向',
        resetToFirstStop: '重設至首站',
        pressStop: '按鐘',
        releaseStop: '解除按鐘',
        handrailNotice: '緊握扶手提示',
        mindDoorNotice: '車門關上提示',
        customizeDriverInfo: '更改車長資料',
        fullscreenMain: '主螢幕：全螢幕顯示',
        fullscreenSec: '輔螢幕：全螢幕顯示',
        driverInfoTooltip: '自定義車長資料顯示',
        fullscreenTooltip: '選擇路線後才能開啟全螢幕顯示功能',
        driverInfoZhPlaceholder: '車長中文姓氏 (最多2字)',
        driverInfoEnPlaceholder: '車長英文姓氏 (最多10字)',
        staffNoPlaceholder: '職員編號 (1位至6位數字)',
        fullscreenLabel: '開啟全螢幕',
        specialTrip: '特別班',
    },
    en: {
        routeLabel: 'Route',
        stopCountLabel: 'Stops',
        currentStopLabel: 'Current stop',
        prevStop: 'Previous stop',
        nextStop: 'Next stop',
        switchDirection: 'Switch direction',
        resetToFirstStop: 'Reset to first stop',
        pressStop: 'Press bell',
        releaseStop: 'Release bell',
        handrailNotice: 'Handrail',
        mindDoorNotice: 'Door-closing',
        customizeDriverInfo: 'Edit driver info',
        fullscreenMain: 'Main display: fullscreen',
        fullscreenSec: 'Aux display: fullscreen',
        driverInfoTooltip: 'Customize driver information display',
        fullscreenTooltip: 'Select a route before enabling fullscreen mode',
        driverInfoZhPlaceholder: 'Driver Chinese surname (max 2 chars)',
        driverInfoEnPlaceholder: 'Driver English surname (max 10 chars)',
        staffNoPlaceholder: 'Staff number (1 to 6 digits)',
        fullscreenLabel: 'Open fullscreen',
        specialTrip: 'Spec.',
        loadingRoutes: 'Syncing route data...',
        searchRoutes: 'Searching routes...',
        routeInputPlaceholder: 'Enter KMB route number',
        nextStopLabel: 'Next stop',
        stoppingAt: 'Stopping at',
        staffNo: 'Staff No.',
    },
}

export const getAppTextConfig = (language = 'zh') => appTextConfig[language === 'en' ? 'en' : 'zh']

export const versionHistoryDialogConfig = {
    zh: {
        title: '版本歷史',
        cancel: '取消',
        empty: '尚未有歷史紀錄。',
    },
    en: {
        title: 'Version history',
        cancel: 'Close',
        empty: 'No previous history available.',
    },
}

export const getVersionHistoryDialogConfig = (language = 'zh') => versionHistoryDialogConfig[language === 'en' ? 'en' : 'zh']

export const errorMessageConfig = {
    fallback: 'An unexpected error occurred. Please try again.',
    refresh: 'Refresh Page',
}

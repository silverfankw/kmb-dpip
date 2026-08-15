export const restoreSelectionDialogConfig = {
    zh: {
        title: '檢測到上次瀏覽的路線，是否恢復先前進度？',
        subtitle: 'Previous route selection detected. Would you like to restore it?',
        confirm: '是 Yes',
        cancel: '否 No',
        routeLabel: '路線',
        directionLabel: '方向',
        stopLabel: '分站',
        recordedAtLabel: '最後記錄於',
    },
    en: {
        title: 'Previous route selection detected. Would you like to restore it?',
        subtitle: 'Previous route selection detected. Would you like to restore it?',
        confirm: 'Yes',
        cancel: 'No',
        routeLabel: 'Route',
        directionLabel: 'Direction',
        stopLabel: 'Stop',
        recordedAtLabel: 'Last recorded at',
    },
}

export const getRestoreSelectionDialogConfig = (language = 'zh') => restoreSelectionDialogConfig[language === 'en' ? 'en' : 'zh']

export const formatStoredRouteDetails = (storedData = {}, language = 'zh') => {
    if (!storedData) return []

    const config = getRestoreSelectionDialogConfig(language)
    const routeSummary = [
        `${config.routeLabel}: ${storedData.route} ${storedData.service_type !== '1' ? (language === 'en' ? 'Special trip' : '特別班次') : ''}`,
        `${config.directionLabel}: ${storedData.orig_tc} → ${storedData.dest_tc}`,
        `${config.stopLabel}: ${storedData.currentStop_tc} (${language === 'en' ? 'stop ' : '第'}${storedData.currentStopIndex + 1}${language === 'en' ? '' : '站'})`,
    ]

    return routeSummary
}

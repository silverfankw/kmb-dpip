export const restoreSelectionDialogConfig = {
    title: '檢測到上次瀏覽的路線，是否恢復先前進度？',
    subtitle: 'Previous route selection detected. Would you like to restore it?',
    confirm: '是 Yes',
    cancel: '否 No',
    routeLabel: '路線',
    directionLabel: '方向',
    stopLabel: '分站',
    recordedAtLabel: '最後記錄於',
}

export const formatStoredRouteDetails = (storedData = {}) => {
    if (!storedData) return []

    const routeSummary = [
        `${restoreSelectionDialogConfig.routeLabel}: ${storedData.route} ${storedData.service_type !== '1' ? '特別班次' : ''}`,
        `${restoreSelectionDialogConfig.directionLabel}: ${storedData.orig_tc} → ${storedData.dest_tc}`,
        `${restoreSelectionDialogConfig.stopLabel}: ${storedData.currentStop_tc} (第${storedData.currentStopIndex + 1}站)`,
    ]

    return routeSummary
}

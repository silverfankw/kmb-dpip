export const routeStoreConfig = {
    routeKeySeparator: '-',
    routeDataUrl: 'https://raw.githubusercontent.com/silverfankw/kmb-route-stop/refs/heads/main/kmb_route_stop.json',
    routeSelectionDefaults: {
        routeDetail: {},
        currentStopIndex: 0,
        lastStopIndex: 0,
        isUserSelectedRoute: false,
        routeHasTwoBound: false,
        isLoading: false,
        loadingError: null,
    },
    userPreferenceDefaults: {
        stopPressed: false,
        driverInfo: { nameZh: '九巴仔', nameEn: 'KMB Boy', staffNo: '1933' },
        customizeDriverInfoToggle: false,
        showMindDoorNotice: false,
        showHandrailNotice: false,
        uiMode: 'night',
    },
    routeDefaults: {
        routes: [],
        routesByKey: {},
        isLoading: false,
        error: null,
        isLoaded: false,
    },
    boundValues: ['I', 'O'],
    uiModes: {
        light: 'light',
        night: 'night',
    },
}

export const buildRouteKey = ({ route, bound, service_type }) => {
    const separator = routeStoreConfig.routeKeySeparator
    return [route, bound, service_type].filter(Boolean).join(separator)
}

export const buildRouteSelectionKey = (routeDetail) => {
    if (!routeDetail) return ''
    return buildRouteKey(routeDetail)
}

export const normalizeValue = (value) => (value == null ? '' : String(value))

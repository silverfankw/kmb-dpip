import { getRouteOperator, routeStoreConfig } from '../store/storeConfig.js'

export const buildStoredSelection = (routeDetail, currentStopIndex, includeTimestamp = false) => {
    if (!routeDetail || Object.keys(routeDetail).length === 0) {
        return null
    }

    const data = {
        operator: getRouteOperator(routeDetail),
        route: routeDetail.route,
        bound: routeDetail.bound,
        service_type: routeDetail.service_type,
        orig_tc: routeDetail.orig_tc,
        orig_en: routeDetail.orig_en,
        dest_tc: routeDetail.dest_tc,
        dest_en: routeDetail.dest_en,
        specialRemark: routeDetail.specialRemark,
        currentStopIndex,
    }

    if (includeTimestamp) {
        data.timestamp = Date.now()
    }

    return data
}

export const buildCtbStops = ctbRoute => ctbRoute?.stops.map((stop, index) => ({
    seq: index + 1, stopId: stop.id, nameZh: stop.zh, nameEn: stop.en, etaMin: null,
}))

export const buildCtbDisplayData = (ctbRoute, ctbStops, ctbStopIndex, driverInfo, isKmb) => ctbRoute && !isKmb ? {
    route: ctbRoute.route,
    directionLabelZh: `往 ${ctbRoute.dest_tc}`,
    directionLabelEn: `to ${ctbRoute.dest_en}`,
    captain: {
        surnameZh: driverInfo.nameZh === routeStoreConfig.userPreferenceDefaults.driverInfo.nameZh ? '城' : driverInfo.nameZh,
        nameEn: driverInfo.nameEn === routeStoreConfig.userPreferenceDefaults.driverInfo.nameEn ? 'Shing' : driverInfo.nameEn,
        staffNo: String(driverInfo.staffNo),
    },
    currentSeq: ctbStopIndex + 1,
    stops: ctbStops,
} : undefined

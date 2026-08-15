import { routeUtilityConfig, parseRouteNumber } from './routeUtilityConfig'

export const itemSeparator = routeUtilityConfig.label.itemSeparator
export const toSeparator = routeUtilityConfig.label.directionSeparator
export const specialTripKey = routeUtilityConfig.label.specialTripKey

export const formatRouteLabel = (route) => ({
    routeNumber: route.route,
    origin: route.orig_tc,
    destination: route.dest_tc,
    isSpecial: route.service_type !== '1',
    remark: route.specialRemark,
})

export const createRouteOption = (route) => {
    const { routeNumber, origin, destination, isSpecial, remark } = formatRouteLabel(route)

    return {
        label: [
            routeNumber,
            `${origin} ${toSeparator} ${destination}`,
            isSpecial ? specialTripKey : '',
            remark || '',
        ].join(itemSeparator),
        value: `${route.route}-${route.bound}-${route.service_type}`,
        detail: route,
        routeLabel: routeNumber,
        originLabel: origin,
        destinationLabel: destination,
        isSpecial,
        specialRemarkLabel: remark || '',
    }
}

export const compareRouteNumbers = (a, b) => {
    const routeA = parseRouteNumber(a.route)
    const routeB = parseRouteNumber(b.route)

    if (routeA.prefix !== routeB.prefix) {
        if (!routeA.prefix) return -1
        if (!routeB.prefix) return 1
        return routeA.prefix.localeCompare(routeB.prefix)
    }

    if (routeA.base !== routeB.base) {
        return routeA.base - routeB.base
    }

    if (!routeA.suffix && routeB.suffix) return -1
    if (!routeB.suffix && routeA.suffix) return 1
    return routeA.suffix.localeCompare(routeB.suffix)
}
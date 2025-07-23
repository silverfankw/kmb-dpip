export const itemSeparator = '｜'
export const toSeparator = "往"
export const specialTripKey = "特別班"

export const formatRouteLabel = (route) => ({
    routeNumber: route.route,
    origin: route.orig_tc,
    destination: route.dest_tc,
    isSpecial: route.service_type !== '1',
    remark: route.specialRemark
})

export const createRouteOption = (route) => {
    const { routeNumber, origin, destination, isSpecial, remark } = formatRouteLabel(route)
    return {
        label: [
            routeNumber,
            `${origin} ${toSeparator} ${destination}`,
            isSpecial ? specialTripKey : '',
            remark || ''
        ].join(itemSeparator),
        value: `${route.route}-${route.bound}-${route.service_type}`,
        detail: route
    }
}

export const compareRouteNumbers = (a, b) => {
    const parseRoute = (route) => {
        // Regex extracting route number pattern
        const match = route.match(/^([A-Z]*)(\d+)([A-Z0-9]*)$/)

        // Capture prefix (letter if exist), base route number, and suffix (letter if exist)
        return match ? {
            prefix: match[1] || '',
            base: parseInt(match[2], 10),
            suffix: match[3] || ''
        } : {
            prefix: '',
            base: Infinity,
            suffix: route
        }
    }

    const routeA = parseRoute(a.route)
    const routeB = parseRoute(b.route)

    // Compare prefixes first (no prefix comes before letters)
    if (routeA.prefix !== routeB.prefix) {
        if (!routeA.prefix) return -1
        if (!routeB.prefix) return 1
        return routeA.prefix.localeCompare(routeB.prefix)
    }

    // Compare base numbers (>=1: list lower in sort, <=-1: list higher in sort)
    if (routeA.base !== routeB.base) {
        return routeA.base - routeB.base
    }

    // Finally compare suffixes
    if (!routeA.suffix && routeB.suffix) return -1
    if (!routeB.suffix && routeA.suffix) return 1
    return routeA.suffix.localeCompare(routeB.suffix)
}
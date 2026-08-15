export const routeUtilityConfig = {
    label: {
        itemSeparator: '｜',
        directionSeparator: '往',
        specialTripKey: '特別班',
    },
    routeNumberPattern: /^([A-Z]*)(\d+)([A-Z0-9]*)$/,
    stopIdPattern: /\([A-Z]{2}\d{3}[A-Za-z]?\)$/,
    stopNameCleanupPattern: /[,-]/g,
    boundConversions: {
        number: { O: '1', I: '2' },
        letter: { '1': 'O', '2': 'I' },
    },
    debounceDelayMs: 250,
}

const routeNumberCache = new Map()

export const parseRouteNumber = (route = '') => {
    const normalizedRoute = String(route ?? '')

    if (routeNumberCache.has(normalizedRoute)) {
        return routeNumberCache.get(normalizedRoute)
    }

    const match = normalizedRoute.match(routeUtilityConfig.routeNumberPattern)

    const parsed = match
        ? {
            prefix: match[1] || '',
            base: Number.parseInt(match[2], 10),
            suffix: match[3] || '',
        }
        : {
            prefix: '',
            base: Infinity,
            suffix: normalizedRoute,
        }

    routeNumberCache.set(normalizedRoute, parsed)
    return parsed
}

import { routeUtilityConfig, parseRouteNumber } from './routeUtilityConfig'
import { buildRouteKey, getRouteOperator } from '../store/storeConfig.js'

export const itemSeparator = routeUtilityConfig.label.itemSeparator
export const toSeparator = routeUtilityConfig.label.directionSeparator
export const specialTripKey = routeUtilityConfig.label.specialTripKey

const MAX_SEARCH_RESULTS = 50
const EMPTY_SEARCH_RESULT = { matches: [], letters: [], nextCharacters: new Set() }

export const buildRouteSearchIndex = routeOptions => {
    const index = new Map([['', { matches: [], letters: [], nextCharacters: new Set() }]])

    routeOptions.forEach(option => {
        const number = option.detail.route.toUpperCase()
        for (let length = 0; length <= number.length; length += 1) {
            const prefix = number.slice(0, length)
            let result = index.get(prefix)
            if (!result) {
                result = { matches: [], letters: [], nextCharacters: new Set() }
                index.set(prefix, result)
            }
            if (result.matches.length < MAX_SEARCH_RESULTS) result.matches.push(option)
            if (number[length]) result.nextCharacters.add(number[length])
        }
    })
    index.forEach(result => {
        result.letters = [...result.nextCharacters].filter(character => /^[A-Z]$/.test(character)).sort()
    })
    return index
}

export const getRouteSearchResult = (index, query) => index.get(query) ?? EMPTY_SEARCH_RESULT

export const formatRouteLabel = (route) => ({
    routeNumber: route.route,
    origin: route.orig_tc,
    destination: route.dest_tc,
    isSpecial: getRouteOperator(route) === 'kmb' && route.service_type !== '1',
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
        value: buildRouteKey(route),
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
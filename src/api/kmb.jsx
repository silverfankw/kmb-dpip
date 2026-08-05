import { transformStopDetail, removeLeadingZero, convertBound, additionalRoutes, additionalRouteStops, hardcodedStopIDs, additionalRouteStopDetails, compareRouteNumbers } from '@utils'

const SPECIAL_ROUTE_REMARK_RESPONSE_KEY = "Desc_CHI"
const ROUTE_STOPS_CACHE_KEY = 'route-stops-cache'
const ROUTE_STOPS_CACHE_LIMIT = 96
const ROUTE_STOPS_CACHE_PERSIST_DELAY = 250

const stopCache = new Map()
const stopDetailPromiseCache = new Map()
const stopIDsCache = new Map()
const routeStopsCache = new Map()
const routeStopsPromiseCache = new Map()
const specialRouteRemarkCache = new Map()
const specialRouteRemarkPromiseCache = new Map()

let routeStopsCachePersistTimeoutId = null

const getRouteCacheKey = (route, bound, service_type) => `${route}-${bound}-${service_type}`

const trimRouteStopsCache = entries => entries.slice(-ROUTE_STOPS_CACHE_LIMIT)

const restoreRouteStopsCache = () => {
    if (typeof localStorage === 'undefined') {
        return
    }

    try {
        const rawCache = localStorage.getItem(ROUTE_STOPS_CACHE_KEY)

        if (!rawCache) {
            return
        }

        const cacheEntries = JSON.parse(rawCache)
        if (!Array.isArray(cacheEntries)) {
            return
        }

        trimRouteStopsCache(cacheEntries).forEach(([key, stops]) => {
            if (typeof key === 'string' && Array.isArray(stops)) {
                routeStopsCache.set(key, stops)
            }
        })
    } catch (error) {
        console.error('Error restoring cached route stops:', error)
        localStorage.removeItem(ROUTE_STOPS_CACHE_KEY)
    }
}

const persistRouteStopsCache = () => {
    if (typeof localStorage === 'undefined') {
        return
    }

    try {
        localStorage.setItem(
            ROUTE_STOPS_CACHE_KEY,
            JSON.stringify(trimRouteStopsCache(Array.from(routeStopsCache.entries())))
        )
    } catch (error) {
        console.error('Error persisting route stops cache:', error)
    }
}

const flushPersistRouteStopsCache = () => {
    if (routeStopsCachePersistTimeoutId !== null) {
        clearTimeout(routeStopsCachePersistTimeoutId)
        routeStopsCachePersistTimeoutId = null
    }

    persistRouteStopsCache()
}

const schedulePersistRouteStopsCache = () => {
    if (typeof window === 'undefined') {
        persistRouteStopsCache()
        return
    }

    if (routeStopsCachePersistTimeoutId !== null) {
        return
    }

    routeStopsCachePersistTimeoutId = window.setTimeout(() => {
        routeStopsCachePersistTimeoutId = null
        persistRouteStopsCache()
    }, ROUTE_STOPS_CACHE_PERSIST_DELAY)
}

restoreRouteStopsCache()

if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushPersistRouteStopsCache)
}

export async function fetchAllRoutes() {
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/')
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    return [...json.data, ...additionalRoutes].sort(compareRouteNumbers)
}

export async function fetchStopIDs(route, bound, service_type) {
    const normalizedBound = bound === "I" || bound === "inbound" ? "inbound" : "outbound"
    const routeCacheKey = `${route}_${bound}_${service_type}`

    if (stopIDsCache.has(routeCacheKey)) {
        return stopIDsCache.get(routeCacheKey)
    }

    if (hardcodedStopIDs[routeCacheKey]) {
        const cachedStopIDs = hardcodedStopIDs[routeCacheKey]
        stopIDsCache.set(routeCacheKey, cachedStopIDs)
        return cachedStopIDs
    }

    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${normalizedBound}/${service_type}`)
    const json = await res.json()
    const data = json.data

    const stopIDs = data.length === 0
        ? additionalRouteStops
            .filter(stop => stop.route === route && stop.bound === bound && stop.service_type === service_type)
            .map(stop => stop.stop)
        : data.map(stop => stop.stop)

    stopIDsCache.set(routeCacheKey, stopIDs)
    return stopIDs
}

export async function fetchStopDetail(stopID) {
    if (stopCache.has(stopID)) {
        return stopCache.get(stopID)
    }

    if (stopDetailPromiseCache.has(stopID)) {
        return stopDetailPromiseCache.get(stopID)
    }

    if (additionalRouteStopDetails[stopID]) {
        const customStop = additionalRouteStopDetails[stopID]
        stopCache.set(stopID, customStop)
        return customStop
    }

    const stopDetailPromise = (async () => {
        try {
            const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`)
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
            }

            const json = await res.json()
            const transformedData = transformStopDetail(json)
            stopCache.set(stopID, transformedData)
            return transformedData
        }
        catch (error) {
            if (additionalRouteStopDetails[stopID]) {
                const customStop = additionalRouteStopDetails[stopID]
                stopCache.set(stopID, customStop)
                return customStop
            }

            console.error(`Error when fetching stop detail for stopID: ${stopID}`, error)
            throw error
        }
        finally {
            stopDetailPromiseCache.delete(stopID)
        }
    })()

    stopDetailPromiseCache.set(stopID, stopDetailPromise)
    return stopDetailPromise
}

export async function fetchAllStops(stopIDs) {
    return Promise.all(stopIDs.map(fetchStopDetail))
}

export async function fetchRouteStops(route, bound, service_type) {
    const routeCacheKey = getRouteCacheKey(route, bound, service_type)

    if (routeStopsCache.has(routeCacheKey)) {
        return routeStopsCache.get(routeCacheKey)
    }

    if (routeStopsPromiseCache.has(routeCacheKey)) {
        return routeStopsPromiseCache.get(routeCacheKey)
    }

    const routeStopsPromise = (async () => {
        try {
            const stopIDs = await fetchStopIDs(route, bound, service_type)
            const routeStops = await fetchAllStops(stopIDs)
            routeStopsCache.set(routeCacheKey, routeStops)
            schedulePersistRouteStopsCache()
            return routeStops
        }
        finally {
            routeStopsPromiseCache.delete(routeCacheKey)
        }
    })()

    routeStopsPromiseCache.set(routeCacheKey, routeStopsPromise)
    return routeStopsPromise
}

export async function fetchSpecialRouteRemark(route, bound, service_type) {
    const routeCacheKey = getRouteCacheKey(route, bound, service_type)

    if (specialRouteRemarkCache.has(routeCacheKey)) {
        return specialRouteRemarkCache.get(routeCacheKey)
    }

    if (specialRouteRemarkPromiseCache.has(routeCacheKey)) {
        return specialRouteRemarkPromiseCache.get(routeCacheKey)
    }

    const convertedBound = convertBound(bound, 'number')

    const remarkPromise = (async () => {
        try {
            const res = await fetch(`https://search.kmb.hk/KMBWebSite/Function/FunctionRequest.ashx?action=getSpecialRoute&route=${route}&bound=${convertedBound}`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
            }
            const json = await res.json()

            const remark = json.data?.routes?.find(
                ({ Route, Bound, ServiceType }) =>
                    route === Route &&
                    convertedBound === Bound &&
                    service_type === removeLeadingZero(ServiceType?.trim())
            )?.[SPECIAL_ROUTE_REMARK_RESPONSE_KEY] ?? ""

            specialRouteRemarkCache.set(routeCacheKey, remark)
            return remark
        }
        finally {
            specialRouteRemarkPromiseCache.delete(routeCacheKey)
        }
    })()

    specialRouteRemarkPromiseCache.set(routeCacheKey, remarkPromise)
    return remarkPromise
}

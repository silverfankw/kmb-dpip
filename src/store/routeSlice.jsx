import { createSelector, createSlice } from '@reduxjs/toolkit'
import { compareRouteNumbers } from '@utils'

import { routeStoreConfig, buildRouteKey, normalizeValue } from './storeConfig'

let routesLoadPromise = null

const initialState = routeStoreConfig.routeDefaults

const getRouteKey = route => buildRouteKey(route)
const normalizeText = value => normalizeValue(value)

const normalizeStopDetail = (stopId, stopLookup) => {
    const stopDetail = stopLookup?.[stopId]

    if (!stopDetail) {
        return { id: stopId, zh: stopId, en: stopId }
    }

    return {
        id: stopId,
        zh: normalizeText(stopDetail.stop_name_zh ?? stopDetail.name_tc ?? stopId),
        en: normalizeText(stopDetail.stop_name_en ?? stopDetail.name_en ?? stopId),
    }
}

const normalizeRoute = (route, stopLookup) => {
    const stopIDs = Array.isArray(route?.stops) ? route.stops : []
    const normalizedStops = new Array(stopIDs.length)

    for (let i = 0; i < stopIDs.length; i += 1) {
        normalizedStops[i] = normalizeStopDetail(stopIDs[i], stopLookup)
    }

    return {
        route: normalizeText(route.route),
        bound: normalizeText(route.bound),
        service_type: normalizeText(route.service_type),
        orig_tc: normalizeText(route.orig_tc),
        orig_en: normalizeText(route.orig_en),
        dest_tc: normalizeText(route.dest_tc),
        dest_en: normalizeText(route.dest_en),
        specialRemark: normalizeText(route.special_remark_tc ?? route.special_remark_en ?? route.specialRemark ?? ''),
        stops: normalizedStops,
    }
}

const normalizeRoutes = rawData => {
    const stopLookup = rawData?.stops ?? {}
    const sourceRoutes = Array.isArray(rawData?.routes) ? rawData.routes : []
    const sortedRoutes = sourceRoutes.slice().sort(compareRouteNumbers)
    const normalizedRoutes = []
    const seenRouteKeys = new Set()
    const routesByKey = Object.create(null)

    for (let i = 0; i < sortedRoutes.length; i += 1) {
        const route = sortedRoutes[i]
        const key = getRouteKey(route)

        if (seenRouteKeys.has(key)) {
            continue
        }

        seenRouteKeys.add(key)

        const normalizedRoute = normalizeRoute(route, stopLookup)
        normalizedRoutes.push(normalizedRoute)
        routesByKey[key] = normalizedRoute
    }

    return { routes: normalizedRoutes, routesByKey }
}

const selectRouteState = state => state.route

export const selectRoutes = createSelector(
    [selectRouteState],
    routeState => routeState.routes
)

export const selectRoutesByKey = createSelector(
    [selectRouteState],
    routeState => routeState.routesByKey
)

export const selectRouteByKey = routeKey => createSelector(
    [selectRoutesByKey],
    routesByKey => routesByKey[routeKey] ?? null
)

export const getRoutesThunk = () => async (dispatch, getState) => {
    if (getState().route.isLoaded) {
        return
    }

    if (routesLoadPromise) {
        return routesLoadPromise
    }

    dispatch(setLoading(true))
    dispatch(setError(null))

    routesLoadPromise = (async () => {
        try {
            const res = await fetch(routeStoreConfig.routeDataUrl)

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
            }

            const rawText = await res.text()
            const parsedData = JSON.parse(rawText.replace(/:\s*NaN\b/g, ': null'))
            const normalizedRoutes = normalizeRoutes(parsedData)

            dispatch(setRoutes(normalizedRoutes))
            return normalizedRoutes
        }
        catch (error) {
            console.error('Error fetching centralized route data:', error)
            dispatch(setError(error.message))
            throw error
        }
        finally {
            dispatch(setLoading(false))
            routesLoadPromise = null
        }
    })()

    return routesLoadPromise
}

const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setRoutes: (state, action) => {
            state.routes = action.payload.routes
            state.routesByKey = action.payload.routesByKey
            state.isLoaded = true
        },
        setRouteSpecialRemark: (state, action) => {
            const { route, bound, service_type, specialRemark } = action.payload
            const routeKey = buildRouteKey({ route, bound, service_type })
            const targetRoute = state.routesByKey[routeKey] ?? state.routes.find(
                routeItem =>
                    routeItem.route === route &&
                    routeItem.bound === bound &&
                    routeItem.service_type === service_type
            )

            if (!targetRoute || targetRoute.specialRemark === specialRemark) {
                return
            }

            targetRoute.specialRemark = specialRemark
            state.routesByKey[routeKey] = targetRoute
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setRoutes, setRouteSpecialRemark, setLoading, setError } = routeSlice.actions
export default routeSlice.reducer

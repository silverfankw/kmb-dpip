import { createSlice } from '@reduxjs/toolkit'
import { compareRouteNumbers } from '@utils'

const ROUTE_DATA_URL = 'https://raw.githubusercontent.com/silverfankw/kmb-route-stop/refs/heads/main/kmb_route_stop.json'

let routesLoadPromise = null

const initialState = {
    routes: [],
    routesByKey: {},
    isLoading: false,
    error: null,
    isLoaded: false
}

const getRouteKey = route => `${route.route}-${route.bound}-${route.service_type}`

const normalizeText = value => (value == null ? '' : String(value))

const normalizeStopDetail = (stopId, stopLookup) => {
    const stopDetail = stopLookup[stopId]

    if (!stopDetail) {
        return {
            id: stopId,
            zh: stopId,
            en: stopId,
        }
    }

    return {
        id: stopId,
        zh: normalizeText(stopDetail.stop_name_zh ?? stopDetail.name_tc ?? stopId),
        en: normalizeText(stopDetail.stop_name_en ?? stopDetail.name_en ?? stopId),
    }
}

const normalizeRoutes = rawData => {
    const stopLookup = rawData?.stops ?? {}
    const sourceRoutes = Array.isArray(rawData?.routes) ? rawData.routes : []
    const normalizedRoutes = []
    const seenRouteKeys = new Set()
    const routesByKey = {}

    sourceRoutes
        .slice()
        .sort(compareRouteNumbers)
        .forEach(route => {
            const key = getRouteKey(route)

            if (seenRouteKeys.has(key)) {
                return
            }

            seenRouteKeys.add(key)

            const stopIDs = Array.isArray(route.stops) ? route.stops : []

            const normalizedRoute = {
                route: normalizeText(route.route),
                bound: normalizeText(route.bound),
                service_type: normalizeText(route.service_type),
                orig_tc: normalizeText(route.orig_tc),
                orig_en: normalizeText(route.orig_en),
                dest_tc: normalizeText(route.dest_tc),
                dest_en: normalizeText(route.dest_en),
                specialRemark: normalizeText(route.special_remark_tc ?? route.special_remark_en ?? route.specialRemark ?? ''),
                stops: stopIDs.map(stopID => normalizeStopDetail(stopID, stopLookup)),
            }

            normalizedRoutes.push(normalizedRoute)
            routesByKey[key] = normalizedRoute
        })

    return { routes: normalizedRoutes, routesByKey }
}

export const selectRoutes = state => state.route.routes

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
            const res = await fetch(ROUTE_DATA_URL)

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
            const routeKey = `${route}-${bound}-${service_type}`
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

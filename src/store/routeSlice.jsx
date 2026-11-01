import { createSelector, createSlice } from '@reduxjs/toolkit'
import { compareRouteNumbers } from '@utils'
import { normalizeRouteData } from '../utils/routeDataAdapters.js'

import { routeStoreConfig, buildRouteKey } from './storeConfig'

let routesLoadPromise = null

const initialState = routeStoreConfig.routeDefaults

const normalizeRoutes = rawData => {
    const routes = normalizeRouteData(rawData).sort(compareRouteNumbers)
    const routesByKey = Object.create(null)

    routes.forEach(route => {
        routesByKey[buildRouteKey(route)] = route
    })

    return { routes, routesByKey }
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
            const { specialRemark } = action.payload
            const routeKey = buildRouteKey(action.payload)
            const targetRoute = state.routesByKey[routeKey] ?? state.routes.find(
                routeItem => buildRouteKey(routeItem) === routeKey
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

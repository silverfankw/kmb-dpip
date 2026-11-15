import { createSelector, createSlice } from '@reduxjs/toolkit'
import { compareRouteNumbers } from '@utils'
import { normalizeRouteData } from '../utils/routeDataAdapters.js'
import { loadRouteDataset } from '../utils/routeDataLoader.js'

import { routeStoreConfig, buildRouteKey } from './storeConfig'

let routesLoadPromise = null

const initialState = routeStoreConfig.routeDefaults

const normalizeRoutes = rawData => {
    const routes = normalizeRouteData(rawData).sort(compareRouteNumbers)
    const ctbRoutes = normalizeRouteData(rawData, 'ctb').sort(compareRouteNumbers)
    const routesByKey = Object.create(null)

    routes.forEach(route => {
        routesByKey[buildRouteKey(route)] = route
    })

    return { routes, ctbRoutes, routesByKey }
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

export const getRoutesThunk = ({ force = false } = {}) => async (dispatch, getState) => {
    if (routesLoadPromise) {
        return routesLoadPromise
    }
    if (getState().route.isLoaded && !force) return

    dispatch(setLoading(true))
    dispatch(setError(null))

    routesLoadPromise = (async () => {
        try {
            return await loadRouteDataset({
                sources: routeStoreConfig.routeDataSources,
                snapshotUrl: `${import.meta.env.BASE_URL}data/route-stop-snapshot.json`,
                normalize: normalizeRoutes,
                force,
                publish: (routes, status) => {
                    dispatch(setRoutes(routes))
                    dispatch(setDataStatus(status))
                    dispatch(setLoading(false))
                },
            })
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
            state.ctbRoutes = action.payload.ctbRoutes
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
        },
        setDataStatus: (state, action) => {
            state.dataStatus = action.payload
        },
    }
})

export const { setRoutes, setRouteSpecialRemark, setLoading, setError, setDataStatus } = routeSlice.actions
export default routeSlice.reducer

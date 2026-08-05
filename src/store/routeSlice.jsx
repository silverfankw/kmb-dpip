import { fetchAllRoutes, fetchSpecialRouteRemark } from '@api/kmb'
import { createSlice } from '@reduxjs/toolkit'

const ROUTES_CACHE_KEY = 'routes'
const ROUTES_CACHE_PERSIST_DELAY = 250

let routesCachePersistTimeoutId = null

const initialState = {
    routes: [],
    isLoading: false,
    error: null
}

const getRouteKey = route => `${route.route}-${route.bound}-${route.service_type}`

const normalizeRoutes = routes => routes.map(route => ({
    ...route,
    specialRemark: route.specialRemark ?? ""
}))

const cacheRoutes = routes => {
    localStorage.setItem(ROUTES_CACHE_KEY, JSON.stringify(routes))
}

const flushRoutesCache = routes => {
    if (routesCachePersistTimeoutId !== null) {
        clearTimeout(routesCachePersistTimeoutId)
        routesCachePersistTimeoutId = null
    }

    cacheRoutes(routes)
}

const scheduleCacheRoutes = routes => {
    if (typeof window === 'undefined') {
        cacheRoutes(routes)
        return
    }

    if (routesCachePersistTimeoutId !== null) {
        clearTimeout(routesCachePersistTimeoutId)
    }

    routesCachePersistTimeoutId = window.setTimeout(() => {
        routesCachePersistTimeoutId = null
        cacheRoutes(routes)
    }, ROUTES_CACHE_PERSIST_DELAY)
}

export const selectRoutes = state => state.routes

export const fetchRoutesThunk = () => async (dispatch) => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
        const routes = await fetchAllRoutes()
        const baseRoutes = normalizeRoutes(routes)

        dispatch(setRoutes(baseRoutes))
        flushRoutesCache(baseRoutes)
    }
    catch (error) {
        console.error('Error fetching routes:', error)
        dispatch(setError(error.message))
    }
    finally {
        dispatch(setLoading(false))
    }
}

export const getRoutesThunk = () => async (dispatch) => {
    const cachedRoutes = localStorage.getItem(ROUTES_CACHE_KEY)

    if (cachedRoutes) {
        try {
            dispatch(setRoutes(normalizeRoutes(JSON.parse(cachedRoutes))))
            return
        }
        catch (error) {
            console.error('Error reading cached routes:', error)
            localStorage.removeItem(ROUTES_CACHE_KEY)
        }
    }

    dispatch(fetchRoutesThunk())
}

export const ensureRouteRemarkThunk = routeDetail => async (dispatch, getState) => {
    if (!routeDetail || routeDetail.service_type === "1") {
        return
    }

    const currentRoute = getState().route.routes.find(
        route => getRouteKey(route) === getRouteKey(routeDetail)
    )

    if (!currentRoute || currentRoute.specialRemark) {
        return
    }

    try {
        const remark = await fetchSpecialRouteRemark(
            routeDetail.route,
            routeDetail.bound,
            routeDetail.service_type
        )

        dispatch(setRouteSpecialRemark({
            route: routeDetail.route,
            bound: routeDetail.bound,
            service_type: routeDetail.service_type,
            specialRemark: remark ?? ""
        }))
    }
    catch (error) {
        console.error(`Error fetching special remark for route ${getRouteKey(routeDetail)}:`, error)
    }
}

const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setRoutes: (state, action) => {
            state.routes = action.payload
        },
        setRouteSpecialRemark: (state, action) => {
            const { route, bound, service_type, specialRemark } = action.payload
            const targetRoute = state.routes.find(
                routeItem =>
                    routeItem.route === route &&
                    routeItem.bound === bound &&
                    routeItem.service_type === service_type
            )

            if (!targetRoute || targetRoute.specialRemark === specialRemark) {
                return
            }

            targetRoute.specialRemark = specialRemark
            scheduleCacheRoutes(state.routes)
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

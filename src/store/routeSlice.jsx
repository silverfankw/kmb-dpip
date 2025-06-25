import { fetchAllRoutes, fetchSpecialRouteRemark } from '@api/kmb'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    routes: [],
    isLoading: false,
    error: null
}

export const selectRoutes = state => state.routes

export const fetchRoutesThunk = () => async (dispatch) => {
    dispatch(setLoading(true))

    try {
        const routes = await fetchAllRoutes()

        // Map of all routes for faster lookup
        const routeMap = new Map(
            routes.map(route => [
                `${route.route}-${route.bound}-${route.service_type}`,
                route
            ])
        )

        // Get special routes and fetch remarks in one pass
        const specialRoutePromises = routes
            .filter(route => route.service_type !== "1")
            .map(async route => {
                const remark = await fetchSpecialRouteRemark(
                    route.route,
                    route.bound,
                    route.service_type
                )

                // Update route in map directly
                const key = `${route.route}-${route.bound}-${route.service_type}`
                routeMap.set(key, { ...route, specialRemark: remark })
            })

        // Wait for all special route remarks to be fetched
        await Promise.all(specialRoutePromises)

        // Convert map back to array
        const routesWithRemarks = Array.from(routeMap.values())

        localStorage.setItem('routes', JSON.stringify(routesWithRemarks))
        dispatch(setRoutes(routesWithRemarks))
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
    const cachedRoutes = localStorage.getItem('routes')

    if (cachedRoutes) {
        dispatch(setRoutes(JSON.parse(cachedRoutes)))
        return
    }

    dispatch(fetchRoutesThunk())
}

const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setRoutes: (state, action) => {
            state.routes = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setRoutes, setLoading, setError } = routeSlice.actions
export default routeSlice.reducer

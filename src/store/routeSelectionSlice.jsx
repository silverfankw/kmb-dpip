import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchStopIDs, fetchAllStops } from '@api/kmb'

const initialState = {
    routeDetail: {},
    currentStopIndex: 0,
    lastStopIndex: 0,
    isUserSelectedRoute: false,
    routeHasTwoBound: false,
    isLoading: false,
    loadingError: null
}

export const selectIsPrevStopAvailable = state => state.routeSelection.currentStopIndex > 0

export const selectIsNextStopAvailable = state => state.routeSelection.currentStopIndex < state.routeSelection.lastStopIndex

export const selectRouteThunk = createAsyncThunk(
    'routeSelection/selectRoute',
    async ({ routeDetail, routes }, { dispatch }) => {
        dispatch(setIsLoading(true))
        dispatch(setLoadingError(null))

        try {
            const { route, bound, service_type, orig_tc, orig_en, dest_tc, dest_en } = routeDetail

            // Check if the route has both inbound and outbound
            const hasTwoBound =
                routes.some(r => r.bound === "I" && r.route === route) &&
                routes.some(r => r.bound === "O" && r.route === route)
            dispatch(setRouteHasTwoBound(hasTwoBound))

            // Normalize bound to "inbound" or "outbound"
            const normalizedBound = bound === "I" || bound === "inbound" ? "inbound" : "outbound"

            // Fetch stopIDs for the selected route and bound
            const stopIDs = await fetchStopIDs(route, normalizedBound, service_type)

            // Fetch all stop details for the selected route
            const routeAllStops = await fetchAllStops(stopIDs)

            dispatch(setCurrentStopIndex(0))
            dispatch(setRouteDetail({
                route,
                bound: normalizedBound,
                stops: routeAllStops,
                orig_tc,
                orig_en,
                dest_tc,
                dest_en,
                service_type,
            }))
            dispatch(setIsUserSelectedRoute(true))
        }
        catch (error) {
            dispatch(setLoadingError(error.message))
        }
        finally {
            dispatch(setIsLoading(false))
        }
    }
)

export const changeBoundThunk = createAsyncThunk(
    'routeSelection/changeBound',
    async (_, { getState, dispatch }) => {
        const routeSelection = getState().routeSelection
        const routes = getState().routes

        const { routeDetail, routeHasTwoBound, isUserSelectedRoute } = routeSelection

        if (
            isUserSelectedRoute &&
            (routeHasTwoBound || routeDetail?.service_type === 1)
        ) {
            const { bound } = routeDetail
            const newBound = bound === "inbound" ? "outbound" : "inbound"

            dispatch(
                selectRouteThunk({
                    routeDetail: { ...routeDetail, bound: newBound },
                    routes
                })
            )
        }
    }
)

const routeSelectionSlice = createSlice({
    name: 'routeSelection',
    initialState,
    reducers: {
        setRouteDetail(state, action) {
            state.routeDetail = action.payload
            state.lastStopIndex = (action.payload.stops?.length ?? 1) - 1
        },
        setCurrentStopIndex(state, action) {
            state.currentStopIndex = action.payload
        },
        toPrevStop(state) {
            if (state.currentStopIndex > 0) {
                state.currentStopIndex -= 1
            }
        },
        toNextStop(state) {
            if (state.currentStopIndex < state.lastStopIndex) {
                state.currentStopIndex += 1
            }
        },
        resetToFirstStop(state) {
            state.currentStopIndex = 0
        },
        setIsUserSelectedRoute(state, action) {
            state.isUserSelectedRoute = action.payload
        },
        setRouteHasTwoBound(state, action) {
            state.routeHasTwoBound = action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setLoadingError: (state, action) => {
            state.loadingError = action.payload
        },
    },

})

export const {
    setRouteDetail,
    setCurrentStopIndex,
    toPrevStop,
    toNextStop,
    resetToFirstStop,
    setIsUserSelectedRoute,
    setRouteHasTwoBound,
    setIsLoading,
    setLoadingError
} = routeSelectionSlice.actions

export default routeSelectionSlice.reducer

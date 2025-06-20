import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchStopIDs, fetchAllStops } from '@api/kmb'

const initialState = {
    routeDetail: {},
    currentStopIndex: 0,
    lastStopIndex: 0,
    isUserSelectedRoute: false,
    routeHasTwoBound: false,
}

export const selectIsPrevStopAvailable = state => state.routeSelection.currentStopIndex > 0

export const selectIsNextStopAvailable = state => state.routeSelection.currentStopIndex < state.routeSelection.lastStopIndex

export const selectRouteThunk = createAsyncThunk(
    'routeSelection/selectRoute',
    async ({ routeDetail, routes }, { dispatch }) => {
        const { route, bound, service_type, orig_tc, orig_en, dest_tc, dest_en } = routeDetail

        // Check if the route has both inbound and outbound
        const hasTwoBound =
            routes.some(r => r.bound === "I" && r.route === route) &&
            routes.some(r => r.bound === "O" && r.route === route)
        dispatch(setRouteHasTwoBound(hasTwoBound))

        const normalizedBound = bound === "I" || bound === "inbound" ? "inbound" : "outbound"
        const stopIDs = await fetchStopIDs(route, normalizedBound, service_type)
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
} = routeSelectionSlice.actions

export default routeSelectionSlice.reducer

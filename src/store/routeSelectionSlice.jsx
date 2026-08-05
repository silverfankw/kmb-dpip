import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchRouteStops, fetchSpecialRouteRemark } from '@api/kmb'

const initialState = {
    routeDetail: {},
    currentStopIndex: 0,
    lastStopIndex: 0,
    isUserSelectedRoute: false,
    routeHasTwoBound: false,
    isLoading: false,
    loadingError: null
}

const getSelectedRouteKey = routeDetail => routeDetail
    ? `${routeDetail.route}-${routeDetail.bound}-${routeDetail.service_type}`
    : ""

const hasBothBounds = (routes, route) =>
    routes.some(r => r.bound === "I" && r.route === route) &&
    routes.some(r => r.bound === "O" && r.route === route)

export const selectIsPrevStopAvailable = state => state.routeSelection.currentStopIndex > 0

export const selectIsNextStopAvailable = state => state.routeSelection.currentStopIndex < state.routeSelection.lastStopIndex

export const selectRouteThunk = createAsyncThunk(
    'routeSelection/selectRoute',
    async ({ routeDetail, routes }, { dispatch, getState }) => {
        const requestedRouteKey = getSelectedRouteKey(routeDetail)
        const currentSelection = getState().routeSelection
        const currentRouteKey = getSelectedRouteKey(currentSelection.routeDetail)
        const hasTwoBound = hasBothBounds(routes, routeDetail.route)

        dispatch(setRouteHasTwoBound(hasTwoBound))
        dispatch(setLoadingError(null))

        if (requestedRouteKey === currentRouteKey && currentSelection.routeDetail?.stops?.length > 0) {
            dispatch(setCurrentStopIndex(0))
            dispatch(setIsUserSelectedRoute(true))
            return
        }

        dispatch(setIsLoading(true))

        try {
            const { route, bound, service_type, orig_tc, orig_en, dest_tc, dest_en, specialRemark } = routeDetail
            const routeAllStops = await fetchRouteStops(route, bound, service_type)

            dispatch(setCurrentStopIndex(0))
            dispatch(setRouteDetail({
                route,
                bound,
                stops: routeAllStops,
                orig_tc,
                orig_en,
                dest_tc,
                dest_en,
                service_type,
                specialRemark,
            }))
            dispatch(setIsUserSelectedRoute(true))

            if (service_type !== "1" && !specialRemark) {
                void (async () => {
                    try {
                        const fetchedRemark = await fetchSpecialRouteRemark(route, bound, service_type)
                        dispatch(setRouteDetailSpecialRemark({
                            route,
                            bound,
                            service_type,
                            specialRemark: fetchedRemark ?? ""
                        }))
                    }
                    catch (error) {
                        console.error(`Error fetching selected route remark for ${route}-${bound}-${service_type}:`, error)
                    }
                })()
            }

            if (hasTwoBound) {
                const oppositeBound = bound === "I" ? "O" : "I"
                void fetchRouteStops(route, oppositeBound, service_type).catch(error => {
                    console.error(`Error prefetching stops for route ${route} ${oppositeBound}:`, error)
                })
            }
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
        const routes = getState().route.routes

        const { routeDetail, routeHasTwoBound, isUserSelectedRoute } = routeSelection

        if (
            isUserSelectedRoute &&
            (routeHasTwoBound || routeDetail?.service_type === 1)
        ) {
            const { bound, orig_tc, dest_tc, orig_en, dest_en } = routeDetail
            const newBound = bound === "I" ? "O" : "I"

            dispatch(
                selectRouteThunk({
                    routeDetail: {
                        ...routeDetail,
                        bound: newBound,
                        dest_tc: orig_tc,
                        orig_tc: dest_tc,
                        dest_en: orig_en,
                        orig_en: dest_en,
                    },
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
        setRouteDetailSpecialRemark(state, action) {
            const { route, bound, service_type, specialRemark } = action.payload

            if (
                state.routeDetail.route !== route ||
                state.routeDetail.bound !== bound ||
                state.routeDetail.service_type !== service_type ||
                state.routeDetail.specialRemark === specialRemark
            ) {
                return
            }

            state.routeDetail = {
                ...state.routeDetail,
                specialRemark
            }
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
    setRouteDetailSpecialRemark,
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

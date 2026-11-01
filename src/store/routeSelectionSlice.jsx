import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

import { routeStoreConfig, buildRouteSelectionKey, getRouteOperator } from './storeConfig'

const initialState = routeStoreConfig.routeSelectionDefaults

const getSelectedRouteKey = routeDetail => buildRouteSelectionKey(routeDetail)

const hasOppositeBound = (routes, routeDetail) => {
    const { bound } = routeDetail
    const oppositeBound = bound === 'I' ? 'O' : bound === 'O' ? 'I' : null
    if (!oppositeBound) return false

    const oppositeKey = getSelectedRouteKey({ ...routeDetail, bound: oppositeBound })
    return routes.some(item => getSelectedRouteKey(item) === oppositeKey)
}

const selectRouteSelection = state => state.routeSelection
const selectCurrentStopIndex = createSelector(
    [selectRouteSelection],
    routeSelection => routeSelection.currentStopIndex
)
const selectLastStopIndex = createSelector(
    [selectRouteSelection],
    routeSelection => routeSelection.lastStopIndex
)
const selectRouteDetail = createSelector(
    [selectRouteSelection],
    routeSelection => routeSelection.routeDetail
)

export const selectNavigationState = createSelector(
    [selectRouteSelection],
    ({ currentStopIndex, lastStopIndex, routeDetail, isUserSelectedRoute, routeHasTwoBound }) => ({
        currentStopIndex,
        lastStopIndex,
        routeDetail,
        isUserSelectedRoute,
        routeHasTwoBound,
    })
)

export const selectIsPrevStopAvailable = createSelector(
    [selectCurrentStopIndex],
    currentStopIndex => currentStopIndex > 0
)

export const selectIsNextStopAvailable = createSelector(
    [selectCurrentStopIndex, selectLastStopIndex],
    (currentStopIndex, lastStopIndex) => currentStopIndex < lastStopIndex
)

export const selectIsBoundSwitchable = createSelector(
    [selectNavigationState],
    ({ isUserSelectedRoute, routeHasTwoBound }) =>
        isUserSelectedRoute && routeHasTwoBound
)

export const selectCurrentStopMeta = createSelector(
    [selectRouteDetail, selectCurrentStopIndex],
    (routeDetail, currentStopIndex) => ({
        stop: routeDetail?.stops?.[currentStopIndex] ?? null,
        total: routeDetail?.stops?.length ?? 0,
        index: currentStopIndex,
    })
)

export const selectRouteThunk = createAsyncThunk(
    'routeSelection/selectRoute',
    async ({ routeDetail, routes }, { dispatch, getState, rejectWithValue }) => {
        dispatch(setLoadingError(null))
        dispatch(setIsLoading(true))

        try {
            if (getRouteOperator(routeDetail) !== routeStoreConfig.defaultOperator) {
                throw new Error(`Route operator ${getRouteOperator(routeDetail)} is not enabled for selection.`)
            }

            const requestedRouteKey = getSelectedRouteKey(routeDetail)
            const currentSelection = getState().routeSelection
            const currentRouteKey = getSelectedRouteKey(currentSelection.routeDetail)
            const routeState = getState().route
            const selectedRoute = routeState.routesByKey?.[requestedRouteKey] ?? routes.find(
                route => getSelectedRouteKey(route) === requestedRouteKey
            )

            if (!selectedRoute?.stops?.length) {
                throw new Error(`Route ${requestedRouteKey} is unavailable or has no stops.`)
            }

            dispatch(setRouteHasTwoBound(hasOppositeBound(routes, selectedRoute)))

            if (requestedRouteKey === currentRouteKey && currentSelection.routeDetail?.stops?.length > 0) {
                dispatch(setCurrentStopIndex(0))
                dispatch(setIsUserSelectedRoute(true))
                return selectedRoute
            }

            const { route, bound, service_type, orig_tc, orig_en, dest_tc, dest_en, specialRemark } = selectedRoute

            dispatch(setCurrentStopIndex(0))
            dispatch(setRouteDetail({
                operator: getRouteOperator(selectedRoute),
                route,
                bound,
                stops: selectedRoute.stops,
                orig_tc,
                orig_en,
                dest_tc,
                dest_en,
                service_type,
                specialRemark: specialRemark ?? "",
            }))
            dispatch(setIsUserSelectedRoute(true))
            return selectedRoute
        }
        catch (error) {
            dispatch(setLoadingError(error.message))
            return rejectWithValue(error.message)
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
            routeHasTwoBound
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
            const { specialRemark } = action.payload

            if (
                getSelectedRouteKey(state.routeDetail) !== getSelectedRouteKey(action.payload) ||
                state.routeDetail.specialRemark === specialRemark
            ) {
                return
            }

            state.routeDetail = {
                ...state.routeDetail,
                specialRemark,
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

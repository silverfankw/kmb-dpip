import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

const initialState = []

export const selectRoutes = state => state.routes

export const selectDefaultRouteOptions = createSelector(
    [selectRoutes],
    routes =>
        routes?.slice(0, 50)?.map(route => ({
            label: `${route.route} ｜ ${route.orig_tc} 往 ${route.dest_tc}`,
            value: `${route.route}-${route.bound}-${route.service_type}`,
            detail: route,
        }))
)

export const fetchRouteThunk = createAsyncThunk(
    'routes/fetchRoute',
    async () => {
        const cached = localStorage.getItem("routes")
        if (cached) return JSON.parse(cached)

        const resp = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/")
        const json = await resp.json()
        localStorage.setItem("routes", JSON.stringify(json.data))
        return json.data
    }
)

const routesSlice = createSlice({
    name: 'routes',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchRouteThunk.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export default routesSlice.reducer

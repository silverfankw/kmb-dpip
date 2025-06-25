import { configureStore } from '@reduxjs/toolkit'
import routeReducer from './routeSlice'
import routeSelectionReducer from './routeSelectionSlice'
import userPreferenceReducer from './userPreferenceSlice'

export const store = configureStore({
    reducer: {
        route: routeReducer,
        routeSelection: routeSelectionReducer,
        userPreference: userPreferenceReducer,
    },
})
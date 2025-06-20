import { configureStore } from '@reduxjs/toolkit'
import routesReducer from './routesSlice'
import routeSelectionReducer from './routeSelectionSlice'
import userPreferenceReducer from './userPreferenceSlice'

export const store = configureStore({
    reducer: {
        routes: routesReducer,
        routeSelection: routeSelectionReducer,
        userPreference: userPreferenceReducer,
    },
})
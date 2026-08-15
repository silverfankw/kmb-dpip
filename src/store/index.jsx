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
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredPaths: [
                'route.routes',
                'route.routesByKey',
                'routeSelection.routeDetail',
            ],
            ignoredActionPaths: [
                'payload.routes',
                'payload.routesByKey',
                'payload.routeDetail',
            ],
            warnAfter: 200,
        },
    }),
})
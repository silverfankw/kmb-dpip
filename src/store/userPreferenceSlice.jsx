import { createSelector, createSlice } from '@reduxjs/toolkit'

import { routeStoreConfig } from './storeConfig'

const initialState = routeStoreConfig.userPreferenceDefaults

const selectUserPreference = state => state.userPreference

export const selectUiMode = createSelector([selectUserPreference], userPreference => userPreference.uiMode)
export const selectLanguage = createSelector([selectUserPreference], userPreference => userPreference.language)
export const selectIsLightMode = createSelector([selectUiMode], uiMode => uiMode === routeStoreConfig.uiModes.light)
export const selectNoticeVisibility = createSelector(
    [selectUserPreference],
    ({ showMindDoorNotice, showHandrailNotice }) => ({
        showMindDoorNotice,
        showHandrailNotice,
    })
)
export const selectDriverInfo = createSelector([selectUserPreference], userPreference => userPreference.driverInfo)
export const selectCustomizeDriverInfoToggle = createSelector(
    [selectUserPreference],
    userPreference => userPreference.customizeDriverInfoToggle
)

const userPreferenceSlice = createSlice({
    name: 'userPreference',
    initialState,
    reducers: {
        setStopPressed(state, action) {
            state.stopPressed = action.payload
        },
        setDriverInfo(state, action) {
            state.driverInfo = { ...state.driverInfo, ...action.payload }
        },
        setCustomizeDriverInfoToggle(state, action) {
            state.customizeDriverInfoToggle = action.payload
        },
        setShowMindDoorNotice(state, action) {
            state.showMindDoorNotice = action.payload
        },
        setShowHandrailNotice(state, action) {
            state.showHandrailNotice = action.payload
        },
        setShowHandrailAndMindDoorNotice(state, action) {
            state.showHandrailNotice = action.payload.showHandrailNotice
            state.showMindDoorNotice = action.payload.showMindDoorNotice
        },
        setUiMode(state, action) {
            state.uiMode = action.payload === routeStoreConfig.uiModes.light ? routeStoreConfig.uiModes.light : routeStoreConfig.uiModes.night
        },
        setLanguage(state, action) {
            state.language = action.payload === routeStoreConfig.languages.en ? routeStoreConfig.languages.en : routeStoreConfig.languages.zh
        },
    },
})

export const {
    setStopPressed,
    setDriverInfo,
    setCustomizeDriverInfoToggle,
    setShowMindDoorNotice,
    setShowHandrailNotice,
    setShowHandrailAndMindDoorNotice,
    setUiMode,
    setLanguage,
} = userPreferenceSlice.actions

export default userPreferenceSlice.reducer
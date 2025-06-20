import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    monitorStyle: "basic",
    stopPressed: false,
    driverInfo: { nameZh: "九巴仔", nameEn: "KMB Boy", staffNo: "1933" },
    customizeDriverInfoToggle: false,
    showMindDoorNotice: false,
    showHandrailNotice: false,
}

const userPreferenceSlice = createSlice({
    name: 'userPreference',
    initialState,
    reducers: {
        setMonitorStyle(state, action) {
            state.monitorStyle = action.payload
        },
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
    },
})

export const {
    setMonitorStyle,
    setStopPressed,
    setDriverInfo,
    setCustomizeDriverInfoToggle,
    setShowMindDoorNotice,
    setShowHandrailNotice,
    setShowHandrailAndMindDoorNotice
} = userPreferenceSlice.actions

export default userPreferenceSlice.reducer
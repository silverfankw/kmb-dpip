export const initialUserPreference = {
    monitorStyle: "basic",
    stopPressed: false,
    driverInfo: { nameZh: "九巴仔", nameEn: "KMB Boy", staffNo: "1933" },
    customizeDriverInfoToggle: false,
    mindDoorNotice: false,
    handrailNotice: false,
};

export const userPreferenceReducer = (state, action) => {
    switch (action.type) {
        case "SET_MONITOR_STYLE":
            return { ...state, monitorStyle: action.payload };
        case "SET_STOP_PRESSED":
            return { ...state, stopPressed: action.payload };
        case "SET_DRIVER_INFO":
            return { ...state, driverInfo: { ...state.driverInfo, ...action.payload } };
        case "SET_CUSTOMIZE_DRIVER_INFO_TOGGLE":
            return { ...state, customizeDriverInfoToggle: action.payload };
        case "SET_MIND_DOOR_NOTICE":
            return { ...state, ...action.payload };
        case "SET_HANDRAIL_NOTICE":
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
export const SELECT_THEME = {
    light: {
        text: "#0f172a",
        icon: "#64748b",
        focusedIcon: "#0284c7",
        controlBackground: "#f6f8fb",
        menuBackground: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(248,250,252,0.94))",
    },
    night: {
        text: "#f8fafc",
        icon: "#94a3b8",
        focusedIcon: "#67e8f9",
        controlBackground: "rgba(2, 6, 23, 0.32)",
        menuBackground: "linear-gradient(180deg, rgba(15,23,42,0.86), rgba(15,23,42,0.92))",
    },
}

export const createRouteSelectStyles = (isLightMode, isMobile, selectTheme) => ({
    control: (base, state) => ({
        ...base,
        background: selectTheme.controlBackground,
        color: selectTheme.text,
        boxShadow: state.isFocused
            ? (isLightMode
                ? "0 0 0 3px rgba(14, 165, 233, 0.12)"
                : "0 0 0 3px rgba(56, 189, 248, 0.16)")
            : "none",
        minHeight: 52,
        border: `1px solid ${state.isFocused
            ? (isLightMode ? "#0284c7" : "#38bdf8")
            : (isLightMode ? "#dce3ec" : "rgba(148, 163, 184, 0.22)")}`,
        borderRadius: "12px",
        transition: "border-color 0.16s ease, box-shadow 0.16s ease",
        cursor: state.isDisabled ? "wait" : "text",
        "&:hover": {
            borderColor: state.isFocused
                ? selectTheme.focusedIcon
                : (isLightMode ? "#94a3b8" : "#64748b"),
        }
    }),
    menu: base => ({
        ...base,
        background: selectTheme.menuBackground,
        backdropFilter: "blur(14px)",
        border: `1px solid ${isLightMode ? "rgba(203, 213, 225, 0.82)" : "rgba(148, 163, 184, 0.18)"}`,
        borderRadius: "14px",
        boxShadow: isLightMode ? "0 12px 24px rgba(148, 163, 184, 0.12)" : "0 18px 32px rgba(2, 6, 23, 0.28)",
        color: selectTheme.text,
        zIndex: 99999,
        fontSize: isMobile ? "14px" : base.fontSize,
        overflow: "hidden",
        width: "100%",
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 99999,
    }),
    menuList: base => ({
        ...base,
        maxHeight: isMobile ? "220px" : "420px",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "5px",
        "&::-webkit-scrollbar": {
            width: "8px",
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "rgba(148, 163, 184, 0.35)",
            borderRadius: "999px",
            "&:hover": {
                background: "rgba(148, 163, 184, 0.5)",
            },
        },
    }),
    option: (base, state) => ({
        ...base,
        position: "relative",
        border: state.isSelected
            ? `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.52)" : "rgba(96, 165, 250, 0.56)"}`
            : state.isFocused
                ? `1px solid ${isLightMode ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.14)"}`
                : "1px solid transparent",
        borderRadius: "10px",
        backgroundColor: state.isSelected
            ? (isLightMode ? "linear-gradient(135deg, rgba(224, 242, 254, 0.92), rgba(191, 219, 254, 0.78))" : "linear-gradient(135deg, rgba(30, 64, 175, 0.18), rgba(14, 116, 144, 0.2))")
            : state.isFocused
                ? (isLightMode ? "rgba(248, 250, 252, 0.94)" : "rgba(30, 41, 59, 0.8)")
                : "transparent",
        color: isLightMode ? "#0f172a" : (state.isSelected ? "#e0f2fe" : "#e2e8f0"),
        cursor: "pointer",
        margin: "1px 0",
        padding: "8px 10px",
        width: "auto",
        whiteSpace: "normal",
        wordWrap: "break-word",
        transition: "background-color 0.18s ease, border-color 0.18s ease",
        "&:hover": {
            backgroundColor: isLightMode ? "rgba(186, 230, 253, 0.44)" : "rgba(59, 130, 246, 0.12)",
            border: `1px solid ${isLightMode ? "rgba(14, 165, 233, 0.36)" : "rgba(96, 165, 250, 0.28)"}`,
        },
        "&:active": {
            backgroundColor: isLightMode ? "rgba(186, 230, 253, 0.58)" : "rgba(59, 130, 246, 0.16)",
        }
    }),
    input: base => ({
        ...base,
        color: selectTheme.text,
        fontSize: "16px",
        margin: 0,
        fontWeight: 500,
    }),
    placeholder: base => ({
        ...base,
        color: isLightMode ? "rgba(71, 85, 105, 0.72)" : "rgba(203, 213, 225, 0.7)",
        opacity: 1,
        fontWeight: 500,
        fontSize: "14px",
    }),
    singleValue: base => ({
        ...base,
        color: selectTheme.text,
        margin: 0,
        fontWeight: 500,
        whiteSpace: "normal",
        textOverflow: "clip",
    }),
    valueContainer: base => ({
        ...base,
        padding: "6px 4px 6px 0",
        gap: "2px",
    }),
    indicatorsContainer: base => ({
        ...base,
        alignSelf: "center",
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused
            ? (isLightMode ? "#0284c7" : "#67e8f9")
            : (isLightMode ? "#64748b" : "#94a3b8"),
        width: 44,
        height: 44,
        padding: "12px",
        transition: "color 0.18s ease",
        "&:hover": {
            color: isLightMode ? "#0284c7" : "#67e8f9",
        },
    }),
    noOptionsMessage: base => ({
        ...base,
        color: isLightMode ? "rgba(71, 85, 105, 0.82)" : "rgba(203, 213, 225, 0.72)",
        textAlign: "center",
        padding: "12px",
        fontWeight: 500,
    }),
    loadingMessage: base => ({
        ...base,
        color: isLightMode ? "rgba(71, 85, 105, 0.82)" : "rgba(203, 213, 225, 0.72)",
        textAlign: "center",
        padding: "12px",
        fontWeight: 500,
    }),
})

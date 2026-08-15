import stringWidth from "string-width"

export const PROGRESS_BAR_INTERVAL = 11000
export const STOP_NAME_INTERVAL = 4500
export const FIRST_STOP_WELCOME_ZH = "歡迎乘搭九龍巴士"
export const FIRST_STOP_WELCOME_EN = "WELCOME ABOARD"
export const STOP_NAME_ZH_SAFE_WIDTH_RATIO = 0.985

export const STAGE_DURATIONS = [4500, 4500, 4500]

export const STAGE_INLINE_SAFE_WIDTH_RATIOS = {
    default: {
        1: 1,
        2: 1,
    },
    firstStop: {
        1: 0.8,
        2: 0.95,
    }
}

export const getInlineSafeWidthRatio = (stage, isFirstStop) => {
    const ratioGroup = isFirstStop
        ? STAGE_INLINE_SAFE_WIDTH_RATIOS.firstStop
        : STAGE_INLINE_SAFE_WIDTH_RATIOS.default

    return ratioGroup[stage] ?? 1
}

export const STAGE_Y_SCALE_RANGES = {
    default: {
        0: { min: 0.8, max: 1 },
    },
    firstStop: {
        1: { min: 0.8, max: 0.92 },
        2: { min: 0.86, max: 0.94 },
    }
}

export const getStageScaleYRange = (stage, isFirstStop) => {
    const ratioGroup = isFirstStop
        ? STAGE_Y_SCALE_RANGES.firstStop
        : STAGE_Y_SCALE_RANGES.default

    return ratioGroup?.[stage] ?? { min: 1, max: 1 }
}

export const STAGE_X_SCALE_MAX = {
    firstStop: {
        1: 0.92,
    }
}

export const getStageScaleXMax = (stage, isFirstStop) => {
    if (!isFirstStop) return 1
    return STAGE_X_SCALE_MAX.firstStop?.[stage] ?? 1
}

export const getStopNameZhBaseFontSize = (text) => {
    const visualLength = Math.max(stringWidth(text || ""), 1)
    return Math.max(10.25, Math.min(10.5, 13.5 - (Math.max(visualLength - 6, 0) * 0.3)))
}

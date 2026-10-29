import stringWidth from "string-width"

export const DISPLAY_STAGE_INTERVAL = 10000
export const HEADING_STAGE_INTERVAL = 4500
export const FIRST_STOP_WELCOME_ZH = "歡迎乘搭九龍巴士"
export const FIRST_STOP_WELCOME_EN = "WELCOME ABOARD"
export const STOP_NAME_ZH_SAFE_WIDTH_RATIO = 0.985
export const STOP_NAME_EN_SAFE_SIZE_RATIO = 0.985

const DEFAULT_INLINE_STAGE = {
    safeWidthRatio: 1, maxScaleX: 1, minScaleY: 1, maxScaleY: 1,
}
const FIRST_STOP_INLINE_STAGES = {
    1: { safeWidthRatio: 0.8, maxScaleX: 0.92, minScaleY: 0.8, maxScaleY: 0.92 },
    2: { safeWidthRatio: 0.95, maxScaleX: 1, minScaleY: 0.86, maxScaleY: 0.94 },
}

export const getInlineStageConfig = (stage, isFirstStop) =>
    (isFirstStop && FIRST_STOP_INLINE_STAGES[stage]) || DEFAULT_INLINE_STAGE

export const getStageZeroDestEnMaxScaleX = (text) => {
    const visualLength = stringWidth(text || "")
    return Math.min(1.35, 1.05 + Math.max(visualLength - 12, 0) * 0.02)
}

export const getStopNameZhBaseFontSize = (text) => {
    const visualLength = stringWidth(text || "")
    return Math.max(10.25, Math.min(10.5, 13.5 - Math.max(visualLength - 6, 0) * 0.3))
}

export const getEnglishLines = (name, threshold = 36) => {
    if (!name || name.length <= threshold) return [name]

    const midpoint = Math.floor(name.length / 2)
    const spaces = [...name.matchAll(/\s+/g)]
    const splitIndex = spaces.length
        ? spaces.reduce((closest, space) =>
            Math.abs(space.index - midpoint) < Math.abs(closest.index - midpoint) ? space : closest
        ).index
        : midpoint

    return [name.slice(0, splitIndex).trimEnd(), name.slice(splitIndex).trimStart()]
}

export const getStopProgressPage = (stopCount, currentStopIndex, windowSize) => {
    let start = 0

    do {
        const leadingCount = start > 0 ? 3 : 0
        const available = windowSize - leadingCount
        const trailingCount = stopCount - start > available ? 3 : 0
        const end = Math.min(stopCount, start + available - trailingCount)

        if (currentStopIndex < end || end === stopCount) {
            return { start, end, leadingCount, trailingCount }
        }

        start = end
    } while (start < stopCount)
}

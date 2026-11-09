import stringWidth from "string-width"

const CURRENT_STOP_FONT_CONFIG = {
    en: { singleLine: 7, minSingleLine: 4.6, shrinkAt: 12, shrinkStep: 0.225, wrapped: 5 },
    zh: { min: 7, max: 13, shrinkThreshold: 10, scale: 0.6 },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getCurrentStopFontSize = (visualLength, config) => {
    const preferredSize = clamp(
        config.max - Math.max(0, visualLength - config.shrinkThreshold) * config.scale,
        config.min,
        config.max
    )

    return `clamp(${config.min}cqw, ${preferredSize}cqw, ${config.max}cqw)`
}

const getUpcomingChineseStopStyle = (visualLength) => ({
    fontSize: `clamp(7.5cqw, ${Math.max(18 - visualLength * 0.5, 7.25)}cqw, 9cqw)`,
    paddingTop: visualLength > 26 ? '0.75cqw' : visualLength > 20 ? '0.5cqw' : '0',
    ...(visualLength > 20 && { letterSpacing: '-0.15cqw' }),
})

export const getCurrentStopEnglishMeasurementStyle = (stopName = "") => {
    if (!stopName) return {}

    const characterCount = Array.from(stopName).length
    // Keep the original wrap thresholds independent of single-line font adjustments.
    const fontSize = characterCount >= 20 && characterCount <= 27 ? 6 : 7.2
    return { fontSize: `${fontSize}cqw` }
}

export const getStopNameStyle = (stopName = "", lang = "en", willWrap = false) => {
    if (!stopName) return {}

    const visualLength = stringWidth(stopName)
    const config = CURRENT_STOP_FONT_CONFIG[lang]
    if (!config) return {}

    if (lang === 'en') {
        const characterCount = Array.from(stopName).length
        const singleLineSize = clamp(
            config.singleLine - Math.max(0, characterCount - config.shrinkAt + 1) * config.shrinkStep,
            config.minSingleLine,
            config.singleLine
        )
        return { fontSize: `${willWrap ? config.wrapped : singleLineSize}cqw` }
    }

    return { fontSize: getCurrentStopFontSize(visualLength, config) }
}

export const getUpcomingStopNameStyle = (text, lang) => {
    if (!text) return {}

    if (lang === 'zh') {
        return getUpcomingChineseStopStyle(stringWidth(text))
    }

    return {}
}

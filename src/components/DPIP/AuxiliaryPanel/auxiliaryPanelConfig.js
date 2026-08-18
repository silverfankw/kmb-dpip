import stringWidth from "string-width"

const CURRENT_STOP_FONT_CONFIG = {
    en: { min: 5.5, base: 8.75, scale: 0.09, fallback: 6, max: 10 },
    zh: { min: 7, base: 20, scale: 0.6, fallback: 7, max: 12.5 },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getUpcomingEnglishScaleX = (textLength) => {
    if (textLength <= 30) return 1
    if (textLength >= 38) return 0.8

    return 0.95 - (textLength - 35) * (0.05 / 3)
}

const getCurrentStopFontSize = (visualLength, config) => {
    const preferredSize = clamp(
        config.base - visualLength * config.scale,
        config.fallback,
        config.max
    )

    return `clamp(${config.min}cqw, ${preferredSize}cqw, ${config.max}cqw)`
}

const getCurrentEnglishStopStyle = (visualLength, config) => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280
    const wrapThreshold = Math.max(10, Math.floor(viewportWidth / 70))
    const willWrap = visualLength > wrapThreshold

    if (willWrap) {
        return {
            display: 'flex',
            width: '95%',
            lineHeight: '1.12',
            marginTop: '0.25cqh',
            padding: '0 0.125rem',
            fontSize: `${config.fallback}cqw`,
        }
    }

    return {
        display: 'block',
        width: '100%',
        lineHeight: '1.2',
    }
}

const getUpcomingChineseStopStyle = (visualLength) => ({
    fontSize: `clamp(7cqw, ${Math.max(18 - visualLength * 0.5, 6.75)}cqw, 8.5cqw)`,
    paddingTop: visualLength > 26 ? '0.75cqw' : visualLength > 20 ? '0.5cqw' : '0',
    ...(visualLength > 20 && { letterSpacing: '-0.15cqw' }),
})

const getUpcomingEnglishStopStyle = (textLength) => {
    if (textLength < 30) return {}

    return {
        alignItems: 'start',
        transform: `scale(${getUpcomingEnglishScaleX(textLength)}, 1)`,
        transformOrigin: '0 0',
    }
}

export const getStopNameStyle = (stopName = "", lang = "en") => {
    if (!stopName) return {}

    const visualLength = stringWidth(stopName)
    const config = CURRENT_STOP_FONT_CONFIG[lang]
    if (!config) return {}

    const style = {
        fontSize: getCurrentStopFontSize(visualLength, config),
    }

    if (lang === 'zh') {
        style.marginTop = `${visualLength * 0.0125}cqh`
    } else {
        Object.assign(style, getCurrentEnglishStopStyle(visualLength, config))
    }

    return style
}

export const getUpcomingStopNameStyle = (text, lang) => {
    if (!text) return {}

    if (lang === 'zh') {
        return getUpcomingChineseStopStyle(stringWidth(text))
    }

    return lang === 'en' ? getUpcomingEnglishStopStyle(text.length) : {}
}

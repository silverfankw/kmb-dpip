import stringWidth from "string-width"

export const AUXILIARY_GRID_COLS = "grid-cols-[10fr_90fr]"
export const AUXILIARY_GRID_ROWS = "grid-rows-[3.125fr_0.025fr_1.75fr_0.025fr_1.75fr]"

export const getStopNameStyle = (stopName = "", lang = "en") => {
    if (!stopName) return {}

    const visualLength = stringWidth(stopName)
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280

    const fontSizeConfig = {
        en: { min: 5.5, base: 8.75, scale: 0.09, fallback: 6, max: 10 },
        zh: { min: 7, base: 20, scale: 0.69, fallback: 7, max: 12.5 }
    }

    const config = fontSizeConfig[lang]
    if (!config) return {}

    const dynamicFontSize = Math.min(
        Math.max(config.base - visualLength * config.scale, config.fallback),
        config.max
    )

    const style = {
        fontSize: `clamp(${config.min}cqw, ${dynamicFontSize}cqw, ${config.max}cqw)`
    }

    if (lang === 'zh') {
        style.marginTop = `${visualLength * 0.0125}cqh`
    } else if (lang === 'en') {
        const willWrap = visualLength > Math.max(10, Math.floor(viewportWidth / 18))
        style.display = willWrap ? 'flex' : 'block'
        style.width = '100%'
        style.alignItems = 'center'
        style.alignSelf = 'center'

        if (willWrap) {
            style.lineHeight = '1.12'
            style.marginTop = '0.5cqh'
            style.padding = '0 0.25rem'
        } else {
            style.lineHeight = '1.2'
        }
    }

    return style
}

export const getUpcomingStopNameStyle = (text, lang, windowSize) => {
    if (!text) return {}

    const fontSizeConfig = {
        zh: {
            fontSize: `clamp(6.8cqw, ${Math.max(18 - stringWidth(text) * 0.5, 6.75)}cqw, 8.5cqw)`
        },
        en: (() => {
            const textLength = text.length
            if (textLength < 45) return {}

            const baseSize = windowSize < 768 ? 4 : windowSize < 1280 ? 3.75 : 3.5
            const scale = textLength >= 50 ? 0.8 : 1

            return { fontSize: `${baseSize * scale}cqw` }
        })()
    }

    return fontSizeConfig[lang] || {}
}

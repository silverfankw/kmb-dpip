import { memo, useMemo } from "react"
import stringWidth from "string-width"

// Tailwind CSS style classes
const styles = {
    container: [
        "@container flex flex-col gap-1 max-sm:gap-0.5",
        "relative left-[1.25%]",
        "w-[95%]",
        "h-full",
        "tracking-[-0.0625rem]"
    ].join(" "),

    zhStopName: [
        "h-[12cqw]",
        "relative top-[3cqw]",
        "flex items-center",
        "tracking-normal"
    ].join(" "),

    enStopNameWrapper: [
        "relative top-[17.5%]",
        "flex",
        "items-center",
        "justify-center",
        "h-[33%]",
        "w-full",
        "leading-tight"
    ].join(" "),

    enStopName: [
        "text-[5.5cqw]",
        "leading-[1.2]",
        "w-full"
    ].join(" "),
}

const computeStopNameStyle = (stopName = "", lang = "en") => {
    if (!stopName) return {}

    const visualLength = stringWidth(stopName)
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280

    const fontSizeConfig = {
        en: { min: 5.5, base: 8.75, scale: 0.09, fallback: 6, max: 10 },
        zh: { min: 7, base: 20, scale: 0.66, fallback: 7, max: 12.5 }
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

    if (lang === "zh") {
        style.marginTop = `${visualLength * 0.0125}cqh`
    }
    else if (lang === "en") {
        const willWrap = visualLength > Math.max(10, Math.floor(viewportWidth / 18))
        style.display = willWrap ? "flex" : "block"
        style.width = "100%"
        style.alignItems = "center"
        style.alignSelf = "center"

        if (willWrap) {
            style.lineHeight = "1.12"
            style.marginTop = "0.5cqh"
            style.padding = "0 0.25rem"
        }
        else {
            style.lineHeight = "1.2"
        }
    }

    return style
}

export const CurrentStopNameDisplay = memo(function CurrentStopNameDisplay({ stopZh = "", stopEn = "" }) {
    const zhStyle = useMemo(() => computeStopNameStyle(stopZh, "zh"), [stopZh])
    const enStyle = useMemo(() => computeStopNameStyle(stopEn, "en"), [stopEn])

    return (
        <div className={styles.container}>
            <div
                className={styles.zhStopName}
                style={zhStyle}
            >
                {stopZh}
            </div>
            <div className={styles.enStopNameWrapper}>
                <span
                    className={styles.enStopName}
                    style={enStyle}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
})
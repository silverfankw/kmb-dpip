import stringWidth from "string-width"
import { useWindowSize } from '@hooks/useWindowSize'

// Tailwind CSS style classes
const styles = {
    container: [
        "@container",
        "font-[500]",
        "relative left-[1.25%]",
        "w-[95%] h-[75%]",
        "tracking-[-0.0625rem]"
    ].join(" "),

    zhStopName: [
        "h-[12cqw]",
        "relative top-[2cqw]",
        "flex items-center",
        "tracking-normal"
    ].join(" "),

    enStopNameWrapper: [
        "absolute",
        "top-[80%]",
        "whitespace-nowrap"
    ].join(" "),

    enStopName: [
        "text-[4.75cqw]",
        "max-md:text-[5cqw]"
    ].join(" "),
}

const computeStopNameStyle = (stopName = "", lang = "en") => {
    if (!stopName) return {}

    const visualLength = stringWidth(stopName)

    const fontSizeConfig = {
        en: { min: 4.25, base: 16, scale: 0.445, fallback: 4.5, max: 5.75 },
        zh: { min: 7, base: 20, scale: 0.7, fallback: 7, max: 12.25 }
    }

    const config = fontSizeConfig[lang]
    if (!config) return {}

    const style = {
        fontSize: `clamp(${config.min}cqw, ${Math.max(config.base - visualLength * config.scale, config.fallback)}cqw, ${config.max}cqw)`
    }

    if (lang === "zh") {
        style.marginTop = `${visualLength * 0.0125}cqh`
    }

    return style
}

export const CurrentStopNameDisplay = ({ stopZh = "", stopEn = "" }) => {
    const { windowSize } = useWindowSize()

    return (
        <div className={styles.container}>
            <div
                className={styles.zhStopName}
                style={computeStopNameStyle(stopZh, "zh")}
            >
                {stopZh}
            </div>
            <div className={styles.enStopNameWrapper}>
                <span
                    className={styles.enStopName}
                    style={computeStopNameStyle(stopEn, "en", windowSize)}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
}
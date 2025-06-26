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
        "flex items-center"
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

const computeStopNameStyle = (stopName = "", lang = "en", windowSize) => {
    if (!stopName) return {}

    if (lang === "en") {
        const enFontEmRatio = windowSize < 640 ? 1.8 : windowSize < 768 ? 1.625 : 1.75
        const stopNameFullLen = stopName.length

        if (stopNameFullLen >= 34) {
            if (stopNameFullLen >= 44)
                return { fontSize: `${enFontEmRatio * 2.125}cqw` }
            else
                return { fontSize: `${enFontEmRatio * 2.5}cqw` }
        }
        return {}
    }

    if (lang === "zh") {
        const visualLength = stringWidth(stopName)
        return {
            fontSize: `clamp(7cqw, ${Math.max(20 - visualLength * 0.7, 7)}cqw, 11cqw)`,
        }
    }

    return {}
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
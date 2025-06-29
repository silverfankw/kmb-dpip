import stringWidth from "string-width"
import { useWindowSize } from '@hooks/useWindowSize'

const styles = {
    divider: [
        "col-start-1",
        "col-end-5",
        "bg-[#f7f6f6c5]"
    ].join(" "),

    stopIndicatorContainer: [
        "@container",
        "flex flex-col justify-center items-center",
        "bg-[#FF0000]"
    ].join(" "),

    stopIndicator: [
        "inline-block",
        "rounded-[50%]",
        "bg-white",
        "w-[65cqw] h-[65cqw]"
    ].join(" "),

    stopNameContainer: [
        "@container",
        "relative",
        "flex flex-col",
        "bg-white",
        "tracking-[-0.0375rem]"
    ].join(" "),

    stopNameContent: [
        "@container",
        "font-[500]",
        "relative left-[1.25%]",
        "flex flex-col",
        "h-[90%]",
        "whitespace-nowrap"
    ].join(" "),

    zhStopName: [
        "relative",
        "justify-center",
        "max-md:top-[0.25cqw]",
    ].join(" "),

    enStopName: [
        "justify-center",
        "absolute top-[72.5%]",
        "text-[3.5cqw]",
        "max-sm:text-[3.75cqw]",
        "sm:max-md:text-[3.75cqw]",
        "md:max-xl:text-[3.5cqw]",
    ].join(" ")
}

const getStopNameFontStyle = (text, lang, windowSize) => {
    if (lang === "zh") {
        const visualLength = stringWidth(text || "")
        return {
            fontSize: `clamp(6.8cqw, ${Math.max(18 - visualLength * 0.5, 6.875)}cqw, 8cqw)`,
            marginTop: `${visualLength >= 14 ? visualLength * 0.01 : 0}cqh`,
        }
    }
    else if (lang === "en") {
        const enFontEmRatio = windowSize < 768 ? 4 : windowSize < 1280 ? 3.75 : 3.5
        const stopNameLen = text?.length ?? 0
        if (stopNameLen >= 45) {
            return {
                fontSize: `${enFontEmRatio * (stopNameLen >= 50 ? 0.8 : 0.85)}cqw`
            }
        }
        return {}
    }
    return {}
}

export const UpcomingStopNameDisplay = ({ stopZh = "", stopEn = "" }) => {
    const { windowSize } = useWindowSize()

    return (
        <>
            {/* Horizontal gray divider line */}
            <div className={styles.divider}></div>

            {/* White circle stop indicator */}
            <div className={styles.stopIndicatorContainer}>
                <div className={styles.stopIndicator}></div>
            </div>

            {/* Stop name container */}
            <div className={styles.stopNameContainer}>

                {/* Stop name content */}
                <div className={styles.stopNameContent}>
                    <div
                        className={styles.zhStopName}
                        style={getStopNameFontStyle(stopZh, "zh")}
                    >
                        {stopZh}
                    </div>
                    <span
                        className={styles.enStopName}
                        style={getStopNameFontStyle(stopEn, "en", windowSize)}
                    >
                        {stopEn}
                    </span>
                </div>

            </div>
        </>
    )
}
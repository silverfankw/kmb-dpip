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
        "flex flex-col justify-center",
        "h-[92.5%]",
        "whitespace-nowrap"
    ].join(" "),

    zhStopName: [
        "relative",
        "justify-center",
        "max-md:top-[0.25cqw]",
        "tracking-normal"
    ].join(" "),

    enStopName: [
        "justify-center",
        "text-[3.75cqw]",
        "max-sm:text-[3.75cqw]",
        "sm:max-md:text-[3.75cqw]",
    ].join(" ")
}

const getStopNameFontStyle = (text, lang, windowSize) => {
    if (!text) return {}

    const fontSizeConfig = {
        zh: {
            fontSize: `clamp(6.8cqw, ${Math.max(18 - stringWidth(text) * 0.5, 6.75)}cqw, 8.25cqw)`
        },
        en: (() => {
            const textLength = text.length
            if (textLength < 45) return {}

            const baseSize = windowSize < 768 ? 4 : windowSize < 1280 ? 3.75 : 3.5
            const scale = textLength >= 50 ? 0.8 : 0.85

            return { fontSize: `${baseSize * scale}cqw` }
        })()
    }

    return fontSizeConfig[lang] || {}
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
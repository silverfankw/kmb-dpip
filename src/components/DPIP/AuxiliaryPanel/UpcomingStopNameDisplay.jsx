import stringWidth from "string-width"
import { useWindowWidth } from '@hooks/useWindowWidth'

const styles = {
    divider: "col-start-1 col-end-5 bg-[#f7f6f6c5]",
    stopIndicatorContainer: "@container flex flex-col items-center justify-center bg-[#FF0000]",
    stopIndicator: "inline-block rounded-[50%] bg-white w-[65cqw] h-[65cqw]",
    stopNameContainer: "@container relative flex flex-col bg-white tracking-[-0.0375rem]",
    stopNameContent: "@container font-[500] relative flex flex-col left-[1.5%] h-[90%] whitespace-nowrap",
    zhStopName: "relative max-md:top-[0.25cqw] top-[0.375cqw]",
    enStopName: "absolute top-[72%] max-sm:text-[3.75cqw] sm:max-md:text-[3.5cqw] md:max-xl:text-[3.25cqw] text-[3.25cqw]",
}

const getStopNameFontStyle = (text, lang, windowWidth) => {
    if (lang === "zh") {
        const visualLength = stringWidth(text || "")
        return {
            fontSize: `clamp(7cqw, ${Math.max(18 - visualLength * 0.8, 7)}cqw, 8cqw)`
        }
    }
    else if (lang === "en") {
        const enFontEmRatio = windowWidth < 768 ? 4 : windowWidth < 1280 ? 3.75 : 3.5
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
    const windowWidth = useWindowWidth()

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
                        style={getStopNameFontStyle(stopEn, "en", windowWidth)}
                    >
                        {stopEn}
                    </span>
                </div>

            </div>
        </>
    )
}
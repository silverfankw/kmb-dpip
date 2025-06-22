import stringWidth from "string-width"
import { useWindowWidth } from '@hooks/useWindowWidth'

// Tailwind CSS style classes
const styles = {
    container: "@container font-[500] relative width-[95%] h-[75%] left-[1.5%] tracking-[-0.0625rem]",
    zhStopName: "h-[12cqw] relative top-[2cqw] flex items-center",
    enStopNameWrapper: "absolute top-[80%] whitespace-nowrap",
    enStopName: "max-md:text-[4.25cqw] text-[4cqw]",
}

const computeStopNameStyle = (stopName = "", lang = "en", windowWidth) => {
    if (!stopName) return {}

    if (lang === "en") {
        const enFontEmRatio = windowWidth < 640 ? 1.8 : windowWidth < 768 ? 1.625 : 1.75
        const stopNameFullLen = stopName.length

        if (stopNameFullLen >= 34) {
            if (stopNameFullLen >= 44)
                return { fontSize: `${enFontEmRatio * 2}cqw` }
            else
                return { fontSize: `${enFontEmRatio * 2.4}cqw` }
        }
        return {}
    }

    if (lang === "zh") {
        const visualLength = stringWidth(stopName)
        return { fontSize: `clamp(7cqw, ${Math.max(20 - visualLength * 0.75, 7)}cqw, 11cqw)` }
    }

    return {}
}

export const CurrentStopNameDisplay = ({ stopZh = "", stopEn = "" }) => {
    const windowWidth = useWindowWidth()

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
                    style={computeStopNameStyle(stopEn, "en", windowWidth)}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
}
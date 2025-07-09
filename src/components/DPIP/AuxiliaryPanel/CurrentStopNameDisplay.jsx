import stringWidth from "string-width"

// Tailwind CSS style classes
const styles = {
    container: [
        "@container",
        "font-[500]",
        "relative left-[1.25%]",
        "w-[95%]",
        "h-full",
        "tracking-[-0.0625rem]"
    ].join(" "),

    zhStopName: [
        "h-[12cqw]",
        "relative top-[2cqw]",
        "flex items-center",
        "tracking-normal"
    ].join(" "),

    enStopNameWrapper: [
        "relative top-[15%]",
        "flex",
        "h-[33%]",
        "w-full",
        "leading-tight"
    ].join(" "),

    enStopName: [
        "text-[5.125cqw]",
        "max-md:text-[5.5cqw]",
        "leading-[1.2]",
        "w-full"
    ].join(" "),
}

const computeStopNameStyle = (stopName = "", lang = "en") => {
    if (!stopName) return {}

    const visualLength = stringWidth(stopName)

    const fontSizeConfig = {
        en: {},
        zh: { min: 7, base: 20, scale: 0.66, fallback: 7, max: 12.5 }
    }

    const config = fontSizeConfig[lang]
    if (!config) return {}

    const style = {
        fontSize: `clamp(${config.min}cqw, ${Math.max(config.base - visualLength * config.scale, config.fallback)}cqw, ${config.max}cqw)`
    }

    if (lang === "zh") {
        style.marginTop = `${visualLength * 0.025}cqh`
    }
    else if (lang === "en") {
        const willWrap = visualLength > 38
        style.alignSelf = willWrap ? "flex-start" : "center"
        if (willWrap) {
            style.lineHeight = "1.3"
            style.marginTop = "-.5rem"
        }
    }

    return style
}

export const CurrentStopNameDisplay = ({ stopZh = "", stopEn = "" }) => {

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
                    style={computeStopNameStyle(stopEn, "en")}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
}
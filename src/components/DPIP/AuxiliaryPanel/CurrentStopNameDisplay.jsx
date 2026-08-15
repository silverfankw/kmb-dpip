import { memo, useMemo } from "react"
import { getStopNameStyle } from './auxiliaryPanelConfig'

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

export const CurrentStopNameDisplay = memo(function CurrentStopNameDisplay({ stopZh = "", stopEn = "" }) {
    const zhStyle = useMemo(() => getStopNameStyle(stopZh, "zh"), [stopZh])
    const enStyle = useMemo(() => getStopNameStyle(stopEn, "en"), [stopEn])

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
import { useWindowSize } from '@hooks/useWindowSize'
import { getUpcomingStopNameStyle } from './auxiliaryPanelConfig'

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
        "text-black",
    ].join(" "),

    stopNameContent: [
        "@container",
        "relative left-[1.25%]",
        "flex flex-col justify-center",
        "h-[92.5%]",
        "whitespace-nowrap",
        "leading-tight"
    ].join(" "),

    zhStopName: [
        "relative",
        "justify-center",
        "max-md:top-[0.25cqw]",
        "tracking-tight",
        "leading-snug"
    ].join(" "),

    enStopName: [
        "justify-center",
        "text-[4.25cqw]",
        "tracking-tighter",
    ].join(" ")
}

export const UpcomingStopNameDisplay = ({ stopZh = "", stopEn = "" }) => {
    const { width } = useWindowSize()

    return (
        <>
            <div className={styles.divider}></div>

            <div className={styles.stopIndicatorContainer}>
                <div className={styles.stopIndicator}></div>
            </div>

            <div className={styles.stopNameContainer}>
                <div className={styles.stopNameContent}>
                    <div
                        className={styles.zhStopName}
                        style={getUpcomingStopNameStyle(stopZh, "zh")}
                    >
                        {stopZh}
                    </div>
                    <span
                        className={styles.enStopName}
                        style={getUpcomingStopNameStyle(stopEn, "en", width)}
                    >
                        {stopEn}
                    </span>
                </div>
            </div>
        </>
    )
}
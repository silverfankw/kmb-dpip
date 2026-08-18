import { getUpcomingStopNameStyle } from './auxiliaryPanelConfig'

const styles = {
    divider: [
        "col-start-1",
        "col-end-3",
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
        "h-full self-stretch",
        "bg-white",
        "text-black",
    ].join(" "),

    stopNameContent: [
        "@container",
        "h-full w-full pl-[1.25%]",
        "flex flex-col gap-0.5 justify-between",
        "whitespace-nowrap",
        "leading-tight"
    ].join(" "),

    zhStopName: [
        "relative",
        "tracking-[0.0125rem]",
        "tracking-wide",
    ].join(" "),

    enStopName: [
        "text-[4.625cqw] mb-[0.5cqw]",
    ].join(" ")
}

export const UpcomingStopNameDisplay = ({ stopZh = "", stopEn = "" }) => {

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
                        style={getUpcomingStopNameStyle(stopEn, "en")}
                    >
                        {stopEn}
                    </span>
                </div>
            </div>
        </>
    )
}
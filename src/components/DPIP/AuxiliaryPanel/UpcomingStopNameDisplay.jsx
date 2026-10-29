import { getUpcomingStopNameStyle } from './auxiliaryPanelConfig'

const styles = {
    divider: [
        "col-start-1",
        "col-end-3",
        "bg-[#000000c5]"
    ].join(" "),

    secondDivider: [
        "col-start-1",
        "col-end-3",
        "bg-[#FFFFFF]"
    ].join(" "),

    stopIndicatorContainer: [
        "@container",
        "flex flex-col justify-center items-center",
        "bg-[#EE0000]"
    ].join(" "),

    stopIndicator: [
        "inline-block",
        "rounded-[50%]",
        "bg-white",
        "w-[55cqw] h-[55cqw]"
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
        "font-[450]"
    ].join(" "),

    enStopName: [
        "text-[4.625cqw] mb-[0.5cqw]",
        "font-[450]",
    ].join(" ")
}

export const UpcomingStopNameDisplay = ({ stopZh = "", stopEn = "", isSecondUpcomingStop = false }) => {

    return (
        <>
            <div className={isSecondUpcomingStop ? styles.secondDivider : styles.divider}></div>

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
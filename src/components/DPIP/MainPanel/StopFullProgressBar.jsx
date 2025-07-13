import "@styles/animation.css"

import { useSelector } from "react-redux"
import { useFullProgressBarWindow } from "@hooks"

const splitProgressBarCriteria = 32

const styles = {

    refContainer: "h-full",
    container: [
        "line-container",
        "@container flex",
        "relative top-[87.5%]",
        "w-[95%] h-[92%]",
        "max-md:top-[89%]",
    ].join(" "),

    startLineContainer: "flex gap-[2px] z-1",

    endLineContainer: [
        "flex gap-[2px] justify-end",
        "relative",
        "w-full",
        "max-md:gap-[0.5px]"
    ].join(" "),

    progressBar: [
        "@container line",
        "flex flex-row justify-evenly",
        "absolute left-1.5",
        "w-[98%] h-[1.5cqw]",
        "max-sm:w-[97%]",
        "z-0"
    ].join(" "),

    bullet: [
        "bullet relative",
        "bg-white border border-solid rounded-full",
        "w-[1.5cqw] h-[1.5cqw]",
        "z-1 shrink-0"
    ].join(" "),

    bulletPulse: [
        "animate-bullet-pulse",
        "w-full h-full",
        "rounded-[50%] bg-white"
    ].join(" "),

    startLineBar: [
        "bg-[gray]",
        "w-[.2cqw] h-[2.5cqw]",
        "max-md:w-[.375cqw] max-md:h-[3.5cqw]"
    ].join(" "),

    endLineBar: [
        "bg-[#FF0000]",
        "w-[.2cqw] h-[2.5cqw]",
        "max-md:w-[.375cqw] max-mx:h-[3.5cqw]"
    ].join(" "),

    stopName: [
        "stop-name absolute",
        "text-black text-[1.75cqw]",
        "top-[-2.75cqw] left-1/2",
        "-translate-x-[5%] -rotate-[65deg]",
        "origin-left whitespace-nowrap",
        "max-md:text-[2cqw] max-md:top-[-3cqw]"
    ].join(" "),

    stopNameCurrent: [
        "font-black"
    ].join(" "),

    stopNamePast: [
        "!text-gray-300"
    ].join(" "),

    splitEllipsis: [
        "absolute text-xl",
        "top-[-7cqw] right-[-3cqw]"
    ].join(" ")
}

const StopBullet = ({ stop, i, currentStopIndex }) => {
    const isCurrentStop = i === currentStopIndex
    const isPastStop = i < currentStopIndex

    return (
        <div className={styles.bullet} style={{ position: "relative" }}>
            {isCurrentStop && <div className={styles.bulletPulse} />}
            <div
                className={[
                    styles.stopName,
                    isCurrentStop && styles.stopNameCurrent,
                    isPastStop && styles.stopNamePast
                ].filter(Boolean).join(" ")}
            >
                {stop.zh}
            </div>
        </div>
    )
}

export const StopFullProgressBar = ({ progressBarRef }) => {

    const { routeDetail, currentStopIndex, isUserSelectedRoute } = useSelector(state => state.routeSelection)
    const stopLength = routeDetail?.stops?.length ?? 0

    const rangeSize = splitProgressBarCriteria
    const rangeSlide = Math.floor(rangeSize * 0.8)

    const [windowStart, windowEnd] = useFullProgressBarWindow(
        stopLength, currentStopIndex, rangeSize, rangeSlide)

    const stopsInWindow = windowEnd - windowStart
    const progressInWindow = currentStopIndex - windowStart
    const stopProgressPercentage =
        stopsInWindow > 1
            ? (progressInWindow / (stopsInWindow + 1)) * 100
            : 0

    const showNonEndEllipsis = stopLength > rangeSize && windowEnd < stopLength

    return (
        <div className={styles.refContainer} ref={progressBarRef}>
            <div className={styles.container}>

                {/* Start of Progress Bar */}
                {isUserSelectedRoute && windowStart === 0 && (
                    <div className={styles.startLineContainer}>
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className={styles.startLineBar}></div>
                        ))}
                    </div>
                )}

                {/* Progress Bar */}
                <div
                    style={{
                        background: `linear-gradient(to right, gray 0%, gray ${stopProgressPercentage}%, red ${stopProgressPercentage}%)`,
                    }}
                    className={styles.progressBar}
                >
                    {routeDetail?.stops?.slice(windowStart, windowEnd).map((stop, i) => (
                        <StopBullet
                            key={windowStart + i}
                            stop={stop}
                            i={windowStart + i}
                            currentStopIndex={currentStopIndex}
                        />
                    ))}
                    {showNonEndEllipsis && (
                        <div className={styles.splitEllipsis}>...</div>
                    )}
                </div>

                {/* End of Progress Bar */}
                {isUserSelectedRoute && windowEnd === stopLength && (
                    <div className={styles.endLineContainer}>
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className={styles.endLineBar}></div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
import "@css/animation.css"

import { useSelector } from "react-redux"
import { useFullProgressBarWindow } from "@hooks"

const splitProgressBarCriteria = 32

const styleClasses = {
    container: "@container line-container w-[93%] relative",
    startLineContainer: "flex left-[1px] gap-[2px] absolute z-1",
    startLineBar: "bg-[gray] w-[.2cqw] h-[2.5cqw] max-md:w-[.375cqw] max-md:h-[3.5cqw]",
    progressBar: "@container line flex flex-row justify-evenly absolute left-1.5 w-full h-[1.5cqw] z-0",
    bullet: "bullet w-[1.5cqw] h-[1.5cqw] bg-white border border-solid rounded-full relative z-1 shrink-0",
    bulletPulse: "animate-bullet-pulse w-full h-full rounded-[50%] bg-white",
    stopName: "stop-name text-black text-[1.75cqw] max-md:text-[2cqw] absolute top-[-3cqw] max-md:top-[-3.5cqw] left-1/2 -translate-x-[5%] -rotate-[65deg] origin-left whitespace-nowrap",
    stopNameCurrent: "font-black",
    stopNamePast: "!text-gray-300",
    splitEllipsis: "absolute top-[-7cqw] right-[-3cqw] text-xl",
    endLineContainer: "flex gap-[2px] relative justify-end w-[94.5%] max-md:w-[96%]",
    endLineBar: "bg-[#FF0000] w-[.2cqw] h-[2.5cqw] max-md:w-[.375cqw] max-mx:h-[3.5cqw]",
}

const StopBullet = ({ stop, i, currentStopIndex }) => {
    const isCurrentStop = i === currentStopIndex
    const isPastStop = i < currentStopIndex

    return (
        <div className={styleClasses.bullet} style={{ position: "relative" }}>
            {isCurrentStop && <div className={styleClasses.bulletPulse} />}
            <div
                className={[
                    styleClasses.stopName,
                    isCurrentStop && styleClasses.stopNameCurrent,
                    isPastStop && styleClasses.stopNamePast
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
        <div ref={progressBarRef}>
            <div className={styleClasses.container}>

                {/* Start of Progress Bar */}
                {isUserSelectedRoute && windowStart === 0 && (
                    <div className={styleClasses.startLineContainer}>
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className={styleClasses.startLineBar}></div>
                        ))}
                    </div>
                )}

                {/* Progress Bar */}
                <div
                    style={{
                        background: `linear-gradient(to right, gray 0%, gray ${stopProgressPercentage}%, red ${stopProgressPercentage}%)`,
                    }}
                    className={styleClasses.progressBar}
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
                        <div className={styleClasses.splitEllipsis}>...</div>
                    )}
                </div>
            </div>

            {/* End of Progress Bar */}
            {isUserSelectedRoute && windowEnd === stopLength && (
                <div className={styleClasses.endLineContainer}>
                    {[...Array(2)].map((_, idx) => (
                        <div key={idx} className={styleClasses.endLineBar}></div>
                    ))}
                </div>
            )}
        </div>
    )
}
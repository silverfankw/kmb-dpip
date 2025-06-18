import "../Animation.css"
import { useContext } from "react"
import { routeContext } from "../context/Provider"
import { isEmptyObject } from "../../utility/Util"

const splitProgressBarCriteria = 34

function calculateProgress({
    shouldSplit,
    isFirstPage,
    currentStopIndex,
    stopLength,
}) {
    if (!shouldSplit) return (currentStopIndex / (stopLength + 1)) * 100 ?? 100

    const pageStart = isFirstPage ? 0 : splitProgressBarCriteria
    const pageEnd = isFirstPage ?
        splitProgressBarCriteria + 2 :
        stopLength - splitProgressBarCriteria + 1

    return ((currentStopIndex - pageStart) / pageEnd) * 100 ?? 100
}

// Tailwind CSS classes for the component
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
    splitEllipsis: "absolute top-[-7cqw] right-[3cqw] text-xl",
    endLineContainer: "flex gap-[2px] relative justify-end w-[94.5%] max-md:w-[96%]",
    endLineBar: "bg-[#FF0000] w-[.2cqw] h-[2.5cqw] max-md:w-[.375cqw] max-mx:h-[3.5cqw]",
}

const StopBullet = ({ stop, i, currentStopIndex }) => {
    const isCurrentStop = i === currentStopIndex
    const isPastStop = i < currentStopIndex

    return (
        <div className={styleClasses.bullet} style={{ position: "relative" }}>

            {/* If current Stop: Render animated bullet */}
            {isCurrentStop && <div className={styleClasses.bulletPulse} />}

            {/* Stop name above bullet*/}
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

export const StopFullProgressBar = ({ barRef }) => {
    const { routeDetail, currentStopIndex } = useContext(routeContext)
    const stopLength = routeDetail?.stops?.length ?? 0

    const shouldSplit = stopLength > splitProgressBarCriteria
    const isFirstPage = shouldSplit && currentStopIndex <= splitProgressBarCriteria
    const isSecondPage = shouldSplit && currentStopIndex > splitProgressBarCriteria

    const stopProgressPercentage = calculateProgress({
        shouldSplit,
        isFirstPage,
        currentStopIndex,
        stopLength,
    })

    const shouldDisplayStartLine = !shouldSplit || isFirstPage
    const shouldDisplayEndLine = !shouldSplit || isSecondPage

    return (
        <div ref={barRef}>
            <div className={styleClasses.container}>

                {/* Start of Progress Bar */}
                {!isEmptyObject(routeDetail) && shouldDisplayStartLine && (
                    <div className={styleClasses.startLineContainer}>
                        {[...Array(2)].map((_, idx) => (
                            <div
                                key={idx}
                                className={styleClasses.startLineBar}
                            ></div>
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
                    {routeDetail?.stops?.map((stop, i) => {
                        if (
                            shouldSplit &&
                            ((isFirstPage && i > splitProgressBarCriteria) ||
                                (!isFirstPage && i < splitProgressBarCriteria))
                        )
                            return null
                        return (
                            <StopBullet
                                key={i} stop={stop} i={i}
                                currentStopIndex={currentStopIndex}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Split Ellipsis */}
            {isFirstPage && (
                <div className={styleClasses.splitEllipsis}>...</div>
            )}

            {/* End of Progress Bar */}
            {!isEmptyObject(routeDetail) && shouldDisplayEndLine && (
                <div className={styleClasses.endLineContainer}>
                    {[...Array(2)].map((_, idx) => (
                        <div
                            key={idx}
                            className={styleClasses.endLineBar}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}
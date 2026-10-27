import { memo } from "react"
import "@styles/stopFullProgress.css"

export const FullStopProgress = memo(function FullStopProgress({ stop, stopIndex, currentStopIndex, stopCount, continuation }) {
    const showContinuationDot = Boolean(continuation)
    const isCurrentStop = !showContinuationDot && stopIndex === currentStopIndex
    const isPastStop = continuation === "previous" || (!showContinuationDot && stopIndex < currentStopIndex)
    const isLastStop = !showContinuationDot && stopIndex === stopCount - 1

    return (
        <div className="stop-progress" role="listitem" aria-current={isCurrentStop ? "step" : undefined}>
            <div
                className={`stop-progress__line${isPastStop ? " stop-progress__line--past" : ""}${isCurrentStop && stopIndex > 0 ? " stop-progress__line--current" : ""}`}
                aria-hidden="true"
            />
            {!showContinuationDot && stopIndex === 0 && (
                <div className="stop-progress__terminal stop-progress__terminal--start" aria-hidden="true">
                    <span />
                    <span />
                </div>
            )}
            {isLastStop && (
                <div className="stop-progress__terminal stop-progress__terminal--end" aria-hidden="true">
                    <span />
                    <span />
                </div>
            )}
            <div className="stop-progress__marker-position">
                <svg
                    className={`stop-progress__marker${isCurrentStop ? " stop-progress__marker--current" : ""}`}
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                >
                    <circle cx="50" cy="50" r={isCurrentStop ? 46 : 50} />
                </svg>
                <span
                    className={`stop-name absolute ${isPastStop && !showContinuationDot ? "text-[#878787]" : "text-black"} text-[1.75cqw] max-sm:text-[2cqw] left-1/2 ${showContinuationDot ? "top-[-4cqw] max-md:top-[-4.5cqw] -translate-x-1/2" : "top-[-2.5cqw] max-md:top-[-3cqw] -translate-x-[5%] -rotate-[65deg] origin-left"} whitespace-nowrap max-md:text-[2cqw] ${isCurrentStop ? "font-black" : "font-medium"}`}
                    aria-label={showContinuationDot ? (continuation === "previous" ? "Previous stops" : "More stops") : undefined}
                >
                    {showContinuationDot ? "\u2022" : stop.zh}
                </span>
            </div>
        </div>
    )
})

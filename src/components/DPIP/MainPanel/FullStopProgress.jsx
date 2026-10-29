import { memo } from "react"
import "@styles/fullStopProgress.css"
import { getEnglishLines } from './mainPanelConfig'

export const FullStopProgress = memo(function FullStopProgress({ stop, stopIndex, currentStopIndex, stopCount, continuation, isWide = false, language = 'zh' }) {
    const showContinuationDot = Boolean(continuation)
    const isCurrentStop = !showContinuationDot && stopIndex === currentStopIndex
    const isPastStop = continuation === "previous" || (!showContinuationDot && stopIndex < currentStopIndex)
    const isLastStop = !showContinuationDot && stopIndex === stopCount - 1
    const englishLines = !showContinuationDot && language === 'en' ? getEnglishLines(stop.en, 38) : []
    const englishLineLength = Math.max(1, ...englishLines.map(line => line.length))
    const isLongCurrentEnglish = isCurrentStop && englishLines.length === 1 && englishLineLength > 28

    return (
        <div className={`stop-progress${isWide ? " stop-progress--wide" : ""}`} role="listitem" aria-current={isCurrentStop ? "step" : undefined}>
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
                    lang={showContinuationDot ? undefined : language === 'en' ? 'en' : 'zh-Hant'}
                    style={!showContinuationDot && language === 'en' ? {
                        '--stop-name-en-scale': Math.min(1, (isWide ? 28 : 36) / englishLineLength) * (isLongCurrentEnglish ? 0.85 : 1),
                    } : undefined}
                    className={`stop-name absolute ${isPastStop && !showContinuationDot ? "text-[#878787]" : "text-black"} left-1/2 ${showContinuationDot ? "top-[-4cqw] max-md:top-[-4.5cqw] -translate-x-1/2" : language === 'en' ? "top-[-2.5cqw] max-md:top-[-3cqw] -translate-x-[5%] -rotate-[65deg] origin-left" : "stop-progress__name"} whitespace-nowrap ${isCurrentStop ? "text-[2cqw] max-md:text-[2.25cqw] font-black" : "text-[1.75cqw] max-md:text-[2cqw] font-medium"}`}
                    aria-label={showContinuationDot ? (continuation === "previous" ? "Previous stops" : "More stops") : undefined}
                >
                    {showContinuationDot ? "\u2022" : language === 'en' ? (
                        englishLines.length === 2 ? (
                            <span className="stop-progress__english-wrapped">
                                {englishLines[0]}<br />{englishLines[1]}
                            </span>
                        ) : englishLines[0]
                    ) : stop.zh}
                </span>
            </div>
        </div>
    )
}, (previous, next) =>
    previous.stop === next.stop &&
    previous.stopIndex === next.stopIndex &&
    previous.stopCount === next.stopCount &&
    previous.continuation === next.continuation &&
    previous.isWide === next.isWide &&
    previous.language === next.language &&
    (Boolean(next.continuation) || (
        (previous.stopIndex === previous.currentStopIndex) === (next.stopIndex === next.currentStopIndex) &&
        (previous.stopIndex < previous.currentStopIndex) === (next.stopIndex < next.currentStopIndex)
    ))
)

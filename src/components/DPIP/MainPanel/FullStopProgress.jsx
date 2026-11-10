import { memo } from "react"
import "@styles/mainPanel/fullStopProgress.css"
import { getEnglishLines, getWideEnglishLines, getWideStopNameEnScaleX } from './mainPanelConfig'

export const FullStopProgress = memo(function FullStopProgress({ stop, stopIndex, currentStopIndex, stopCount, continuation, isWide = false, language = 'zh' }) {
    const showContinuationDot = Boolean(continuation)
    const isCurrentStop = !showContinuationDot && stopIndex === currentStopIndex
    const isPastStop = stopIndex < currentStopIndex
    const isLastStop = !showContinuationDot && stopIndex === stopCount - 1
    const englishLines = !showContinuationDot && language === 'en'
        ? isWide ? getWideEnglishLines(stop.en) : getEnglishLines(stop.en, 38)
        : []
    const englishLineLength = Math.max(1, ...englishLines.map(line => line.length))

    return (
        <div className={`stop-progress${isWide ? " stop-progress--wide" : ""}`} role="listitem" aria-current={isCurrentStop ? "step" : undefined}>
            <div
                className={`stop-progress__line${isPastStop ? " stop-progress__line--past" : ""}`}
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
                    viewBox={isCurrentStop ? "0 0 100 100" : "-2 -2 104 104"}
                    aria-hidden="true"
                >
                    <circle cx="50" cy="50" r="50" />
                    {isCurrentStop && (
                        <>
                            <circle className="stop-progress__marker-border" cx="50" cy="50" r="44" />
                            <circle className="stop-progress__marker-center" cx="50" cy="50" r="34" />
                            <path
                                className="stop-progress__marker-shade"
                                d="M82.84 41.2 A34 34 0 0 1 41.2 82.84 C63 78 78 63 82.84 41.2Z"
                            />
                        </>
                    )}
                </svg>
                <span
                    lang={showContinuationDot ? undefined : language === 'en' ? 'en' : 'zh-Hant'}
                    style={!showContinuationDot && language === 'en' ? {
                        '--stop-name-en-scale': isWide ? 1 : Math.min(1, 32 / englishLineLength),
                        '--stop-name-en-scale-x': isWide ? getWideStopNameEnScaleX(englishLineLength)
                            : Math.min(1, 31 / englishLineLength),
                    } : undefined}
                    className={`stop-name${showContinuationDot ? " stop-name--continuation" : language === 'en' ? " stop-name--english" : " stop-progress__name"}${isPastStop && !showContinuationDot ? " stop-name--past" : ""}${isCurrentStop ? " stop-name--current" : ""}`}
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
    (Boolean(next.continuation) ||
        (previous.stopIndex === previous.currentStopIndex) === (next.stopIndex === next.currentStopIndex)) &&
    (previous.stopIndex < previous.currentStopIndex) === (next.stopIndex < next.currentStopIndex)
)

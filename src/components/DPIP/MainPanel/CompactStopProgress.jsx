import { memo, useLayoutEffect, useRef } from "react"
import "@styles/animation.css"
import "@styles/compactStopProgress.css"
import { getEnglishLines } from './mainPanelConfig'

const StopNames = memo(function StopNames({ stop }) {
    const namesRef = useRef(null)
    const englishLines = getEnglishLines(stop.en)
    const isMultilineEnglish = englishLines.length === 2

    useLayoutEffect(() => {
        const names = namesRef.current
        const fit = () => {
            const availableWidth = names.getBoundingClientRect().width
            if (!availableWidth) return

            const measurements = Array.from(names.children, line => {
                const text = line.firstElementChild
                const width = text.offsetWidth
                const scaleX = width ? Math.min(1, availableWidth / width) : 1
                const scaleY = line.lang === "en" ? (isMultilineEnglish ? 0.75 : Math.max(0.9, scaleX)) : 1
                return { text, transform: `scale(${scaleX}, ${scaleY})` }
            })

            for (const { text, transform } of measurements) {
                if (text.style.transform !== transform) text.style.transform = transform
            }
        }

        fit()
        const observer = new ResizeObserver(fit)
        observer.observe(names)
        for (const line of names.children) observer.observe(line.firstElementChild)
        return () => observer.disconnect()
    }, [stop.zh, stop.en, isMultilineEnglish])

    return (
        <div
            className={`compact-stop-progress__names${isMultilineEnglish ? " compact-stop-progress__names--multiline" : ""}`}
            ref={namesRef}
        >
            <div className="compact-stop-progress__zh" lang="zh-Hant"><span>{stop.zh}</span></div>
            <div className="compact-stop-progress__en" lang="en">
                <span>
                    {englishLines[0]}
                    {isMultilineEnglish && <><br />{englishLines[1]}</>}
                </span>
            </div>
        </div>
    )
})

export const CompactStopProgress = memo(function CompactStopProgress({ stops, currentStopIndex, progressBarRef, isWide = false }) {
    const segmentCount = isWide ? 5 : 3
    const visibleStops = stops.slice(currentStopIndex, currentStopIndex + segmentCount).filter(Boolean)
    const isLastStopVisible = currentStopIndex + segmentCount >= stops.length

    return <div className={`compact-stop-progress${isWide ? " compact-stop-progress--wide" : ""}`} ref={progressBarRef}>
        <div className="compact-stop-progress__row" role="list" aria-label="Current and upcoming stops">
            {visibleStops.map((stop, index) => (
                <div
                    className={`compact-stop-progress__stop${index === 0 ? " compact-stop-progress__stop--current" : ""}`}
                    role="listitem"
                    aria-current={index === 0 ? "step" : undefined}
                    key={index}
                >
                    <StopNames stop={stop} />
                    <div className="compact-stop-progress__line" aria-hidden="true" />
                    {index === 0 && (
                        <div className="compact-stop-progress__arrows" aria-hidden="true">
                            <span className="animate-compact-arrow-first" />
                            <span className="animate-compact-arrow-second" />
                            <span className="animate-compact-arrow-third" />
                        </div>
                    )}
                    <svg className="compact-stop-progress__marker" viewBox="0 0 100 100" aria-hidden="true">
                        {index === 0 ? (
                            <>
                                <circle className="compact-stop-progress__ring-white" cx="50" cy="50" r="49" />
                                <circle className="compact-stop-progress__ring-red" cx="50" cy="50" r="42" />
                                <circle className="compact-stop-progress__centre" cx="50" cy="50" r="33" />
                            </>
                        ) : <circle cx="50" cy="50" r="49" />}
                    </svg>
                    {index === visibleStops.length - 1 && (
                        <div
                            className={`compact-stop-progress__terminal${isLastStopVisible ? " compact-stop-progress__terminal--end" : ""}`}
                            aria-hidden="true"
                        >
                            <span />
                            <span />
                            {!isLastStopVisible && <span />}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
})

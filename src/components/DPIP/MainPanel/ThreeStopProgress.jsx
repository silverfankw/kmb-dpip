import { memo, useLayoutEffect, useRef } from "react"
import "@styles/animation.css"
import "@styles/threeStopProgress.css"

const getEnglishLines = (name) => {
    if (!name || name.length <= 36) return [name]

    const midpoint = Math.floor(name.length / 2)
    const spaces = [...name.matchAll(/\s+/g)]
    const splitIndex = spaces.length
        ? spaces.reduce((closest, space) =>
            Math.abs(space.index - midpoint) < Math.abs(closest.index - midpoint) ? space : closest
        ).index
        : midpoint

    return [name.slice(0, splitIndex).trimEnd(), name.slice(splitIndex).trimStart()]
}

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
            className={`three-stop-progress-temp__names${isMultilineEnglish ? " three-stop-progress-temp__names--multiline" : ""}`}
            ref={namesRef}
        >
            <div className="three-stop-progress-temp__zh" lang="zh-Hant"><span>{stop.zh}</span></div>
            <div className="three-stop-progress-temp__en" lang="en">
                <span>
                    {englishLines[0]}
                    {isMultilineEnglish && <><br />{englishLines[1]}</>}
                </span>
            </div>
        </div>
    )
})

export const ThreeStopProgress = memo(function ThreeStopProgress({ currentStop, nextStop, followingStop, progressBarRef, isLastStopVisible = false }) {
    const stops = [currentStop, nextStop, followingStop].filter(Boolean)

    return <div className="three-stop-progress-temp" ref={progressBarRef}>
        <div className="three-stop-progress-temp__row" role="list" aria-label="Current and upcoming stops">
            {stops.map((stop, index) => (
                <div
                    className={`three-stop-progress-temp__stop${index === 0 ? " three-stop-progress-temp__stop--current" : ""}`}
                    role="listitem"
                    aria-current={index === 0 ? "step" : undefined}
                    key={index}
                >
                    <StopNames stop={stop} />
                    <div className="three-stop-progress-temp__line" aria-hidden="true" />
                    {index === 0 && (
                        <div className="three-stop-progress-temp__arrows" aria-hidden="true">
                            <span className="animate-compact-arrow-first" />
                            <span className="animate-compact-arrow-second" />
                            <span className="animate-compact-arrow-third" />
                        </div>
                    )}
                    <svg className="three-stop-progress-temp__marker" viewBox="0 0 100 100" aria-hidden="true">
                        {index === 0 ? (
                            <>
                                <circle className="three-stop-progress-temp__ring-white" cx="50" cy="50" r="49" />
                                <circle className="three-stop-progress-temp__ring-red" cx="50" cy="50" r="42" />
                                <circle className="three-stop-progress-temp__centre" cx="50" cy="50" r="33" />
                            </>
                        ) : <circle cx="50" cy="50" r="49" />}
                    </svg>
                    {index === stops.length - 1 && (
                        <div
                            className={`three-stop-progress-temp__terminal${isLastStopVisible ? " three-stop-progress-temp__terminal--end" : ""}`}
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

import { memo, useLayoutEffect, useRef, useState } from 'react'
import { getUpcomingStopNameStyle } from './auxiliaryPanelConfig'
import '@styles/auxiliaryPanel/upcomingStopName.css'

export const UpcomingStopNameDisplay = memo(function UpcomingStopNameDisplay({ stopZh = "", stopEn = "", isSecondUpcomingStop = false }) {
    const englishRef = useRef(null)
    const measurementRef = useRef(null)
    const [visibleEnglish, setVisibleEnglish] = useState(stopEn)

    useLayoutEffect(() => {
        const visible = englishRef.current
        const measurement = measurementRef.current
        const textNode = measurement.firstChild
        if (!textNode) {
            setVisibleEnglish('')
            return
        }
        const wordEnds = [...stopEn.matchAll(/\S+/g)].map(match => match.index + match[0].length)
        const range = document.createRange()
        range.setStart(textNode, 0)
        const measure = () => {
            const width = visible.clientWidth
            if (!width) return
            let start = 0
            let end = wordEnds.length
            while (start < end) {
                const middle = Math.floor((start + end) / 2)
                range.setEnd(textNode, wordEnds[middle])
                if (range.getBoundingClientRect().width <= width) start = middle + 1
                else end = middle
            }
            // A single oversized first word is clipped, never condensed.
            const lastWordEnd = wordEnds[Math.max(0, start - 1)] ?? 0
            setVisibleEnglish(start === wordEnds.length ? stopEn : stopEn.slice(0, lastWordEnd).trimEnd())
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(visible)
        observer.observe(measurement)
        return () => observer.disconnect()
    }, [stopEn])
    return (
        <>
            <div className={`aux-upcoming-stop__divider${isSecondUpcomingStop ? ' aux-upcoming-stop__divider--second' : ''}`}></div>

            <div className="aux-upcoming-stop__indicator-container">
                <div className="aux-upcoming-stop__indicator"></div>
            </div>

            <div className="aux-upcoming-stop">
                <div className="aux-upcoming-stop__content">
                    <div
                        className="aux-upcoming-stop__chinese"
                        style={getUpcomingStopNameStyle(stopZh, "zh")}
                    >
                        {stopZh}
                    </div>
                    <span
                        ref={measurementRef}
                        aria-hidden="true"
                        className="aux-upcoming-stop__english aux-upcoming-stop__measurement"
                    >
                        {stopEn}
                    </span>
                    <span
                        ref={englishRef}
                        className="aux-upcoming-stop__english aux-upcoming-stop__english--visible"
                        title={stopEn}
                        aria-label={stopEn}
                    >
                        {visibleEnglish}
                    </span>
                </div>
            </div>
        </>
    )
})
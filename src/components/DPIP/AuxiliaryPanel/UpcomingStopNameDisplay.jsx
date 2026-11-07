import { memo, useLayoutEffect, useRef, useState } from 'react'
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
                        ref={measurementRef}
                        aria-hidden="true"
                        className={`${styles.enStopName} absolute invisible w-max pointer-events-none`}
                    >
                        {stopEn}
                    </span>
                    <span
                        ref={englishRef}
                        className={`${styles.enStopName} block w-[90%] overflow-hidden`}
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
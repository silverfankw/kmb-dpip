import { memo, useLayoutEffect, useMemo, useRef, useState } from "react"
import { getCurrentEnglishStopMeasurementStyle, getStopNameStyle } from './auxiliaryPanelConfig'

const styles = {
    container: [
        "@container flex flex-col gap-1 max-sm:gap-0.5",
        "relative left-[1.25%]",
        "w-[95%]",
        "h-full",
        "tracking-[-0.0625rem]"
    ].join(" "),

    zhStopName: [
        "font-[450]",
        "h-[12cqw]",
        "relative top-[3cqw]",
        "flex items-center",
        "tracking-wide"
    ].join(" "),

    enStopNameWrapper: [
        "relative top-[17.5%]",
        "flex",
        "items-center",
        "h-[33%]",
        "w-full",
        "leading-tight"
    ].join(" "),

    enStopName: [
        "font-[450]",
        "text-[5.5cqw]",
        "leading-[1.2]",
        "tracking-[0.00075rem]",
        "w-full"
    ].join(" "),
}

export const CurrentStopNameDisplay = memo(function CurrentStopNameDisplay({ stopZh = "", stopEn = "" }) {
    const enWrapperRef = useRef(null)
    const enMeasureRef = useRef(null)
    const [willWrap, setWillWrap] = useState(false)
    const zhStyle = useMemo(() => getStopNameStyle(stopZh, "zh"), [stopZh])
    const enBaseStyle = useMemo(() => getCurrentEnglishStopMeasurementStyle(stopEn), [stopEn])
    const enStyle = useMemo(() => getStopNameStyle(stopEn, "en", willWrap), [stopEn, willWrap])

    useLayoutEffect(() => {
        const wrapper = enWrapperRef.current
        const measurement = enMeasureRef.current
        const measure = () => {
            const availableWidth = wrapper.getBoundingClientRect().width
            if (availableWidth > 0) {
                setWillWrap(measurement.getBoundingClientRect().width > availableWidth + 0.5)
            }
        }

        measure()
        // Measure at the original size to preserve wrapping thresholds independently of visible text.
        const observer = new ResizeObserver(measure)
        observer.observe(wrapper)
        observer.observe(measurement)
        return () => observer.disconnect()
    }, [stopEn])

    return (
        <div className={styles.container}>
            <div
                className={styles.zhStopName}
                style={zhStyle}
            >
                {stopZh}
            </div>
            <div ref={enWrapperRef} className={styles.enStopNameWrapper}>
                <span
                    ref={enMeasureRef}
                    aria-hidden="true"
                    className={`${styles.enStopName} absolute invisible pointer-events-none whitespace-nowrap`}
                    style={{ ...enBaseStyle, width: 'max-content' }}
                >
                    {stopEn}
                </span>
                <span
                    className={styles.enStopName}
                    style={enStyle}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
})
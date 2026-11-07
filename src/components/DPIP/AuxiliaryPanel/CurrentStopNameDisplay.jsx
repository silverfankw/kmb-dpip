import { memo, useLayoutEffect, useMemo, useRef, useState } from "react"
import { getStopNameStyle } from './auxiliaryPanelConfig'
import '@styles/auxiliaryPanel/currentStopName.css'

export const CurrentStopNameDisplay = memo(function CurrentStopNameDisplay({ stopZh = "", stopEn = "" }) {
    const enWrapperRef = useRef(null)
    const enMeasureRef = useRef(null)
    const [willWrap, setWillWrap] = useState(false)
    const zhStyle = useMemo(() => getStopNameStyle(stopZh, "zh"), [stopZh])
    const enMeasurementStyle = useMemo(() => getStopNameStyle(stopEn, "en"), [stopEn])
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
        <div className="aux-current-stop">
            <div
                className="aux-current-stop__chinese"
                lang="zh-HK"
                style={zhStyle}
            >
                {stopZh}
            </div>
            <div ref={enWrapperRef} className="aux-current-stop__english-wrapper" lang="en">
                <span
                    ref={enMeasureRef}
                    aria-hidden="true"
                    className="aux-current-stop__english aux-current-stop__measurement"
                    style={enMeasurementStyle}
                >
                    {stopEn}
                </span>
                <span
                    className={`aux-current-stop__english${willWrap ? ' aux-current-stop__english--wrapped' : ''}`}
                    style={enStyle}
                >
                    {stopEn}
                </span>
            </div>
        </div>
    )
})
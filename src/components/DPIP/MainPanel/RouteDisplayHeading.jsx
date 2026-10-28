import { memo, useState, useEffect, useRef, useLayoutEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { TripleArrow } from "@components"
import "@styles/routeDisplayHeading.css"
import {
    STAGE_DURATIONS,
    getStageZeroDestEnMaxScaleX,
    getInlineSafeWidthRatio,
    getStageScaleYRange,
    getStageScaleXMax,
} from './mainPanelConfig'

const STAGE_ZERO_DEST_EN_MIN_FONT_SCALE = 0.95

export const RouteDisplayHeading = memo(function RouteDisplayHeading({ onStageChange, isWide = false }) {

    const routeDetail = useSelector(state => state.routeSelection.routeDetail)
    const lastStopIndex = useSelector(state => state.routeSelection.lastStopIndex)
    const atFirstStop = useSelector(state => state.routeSelection.currentStopIndex === 0)
    const [stage, setStage] = useState(0)
    const stageRef = useRef(null)
    const stageWrapperRef = useRef(null)
    const destEnTextRef = useRef(null)
    const destZhTextRef = useRef(null)
    const destZhBaselineRef = useRef(null)
    const routeNumberRef = useRef(null)
    const isFirstStop = routeDetail?.stops?.length > 0 && atFirstStop
    const stageSequence = useMemo(
        () => isFirstStop ? [1, 2] : [0, 1, 2],
        // () => [0],
        [isFirstStop]
    )

    useLayoutEffect(() => {
        setStage(isFirstStop ? 1 : 0)
    }, [isFirstStop, routeDetail?.route, routeDetail?.bound, routeDetail?.service_type])

    useLayoutEffect(() => {
        onStageChange?.(stage)
    }, [onStageChange, stage])

    useEffect(() => {
        const t = setTimeout(() => {
            setStage(currentStage => {
                const currentIndex = stageSequence.indexOf(currentStage)
                const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % stageSequence.length
                return stageSequence[nextIndex]
            })
        }, STAGE_DURATIONS[stage])
        return () => clearTimeout(t)
    }, [stage, stageSequence])

    const zh = routeDetail?.stops?.[lastStopIndex]?.zh
    const en = routeDetail?.stops?.[lastStopIndex]?.en
    const route = routeDetail.route
    const routeLength = String(route ?? "").length
    const isShortRouteNumber = routeLength > 0 && routeLength <= 2

    useLayoutEffect(() => {
        const element = stageRef.current
        const wrapper = stageWrapperRef.current
        const container = stage === 0 ? element : wrapper?.parentElement
        if (!element || !container) return
        const measurementContext = stage === 0 && isWide
            ? document.createElement('canvas').getContext('2d') : null

        const fit = () => {
            if (!container.clientWidth) return

            if (stage === 0) {
                for (const ref of [routeNumberRef, destZhTextRef, destEnTextRef]) {
                    const text = ref.current
                    const cell = text?.parentElement
                    let availableWidth = cell?.clientWidth
                    if (!availableWidth) continue

                    // Wide columns include their gutters, which are not text space.
                    if (isWide) {
                        const { paddingLeft, paddingRight } = window.getComputedStyle(cell)
                        availableWidth = Math.max(0, availableWidth - parseFloat(paddingLeft) - parseFloat(paddingRight))
                    }

                    text.style.transform = ""
                    const textWidth = Math.max(text.scrollWidth, text.getBoundingClientRect().width)
                    if (!textWidth) continue

                    const isEnglish = ref === destEnTextRef
                    const fitScale = availableWidth / textWidth
                    const fontScale = isEnglish && fitScale < STAGE_ZERO_DEST_EN_MIN_FONT_SCALE
                        ? STAGE_ZERO_DEST_EN_MIN_FONT_SCALE
                        : 1
                    const maxScaleX = isEnglish && !isWide ? getStageZeroDestEnMaxScaleX(en) : 1
                    text.style.transform = `scale(${fontScale}) scaleX(${Math.min(fitScale, maxScaleX) / fontScale})`
                }

                if (isWide) {
                    const arrow = element.querySelector('.route-heading-board__arrows svg')
                    const chinese = destZhTextRef.current
                    const baseline = destZhBaselineRef.current
                    if (arrow && chinese && baseline && measurementContext) {
                        // Line boxes contain font whitespace. Use the actual glyph
                        // ascent from the DOM baseline to align the visible ink.
                        const { fontStyle, fontWeight, fontSize, fontFamily } = window.getComputedStyle(chinese)
                        measurementContext.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`
                        const { actualBoundingBoxAscent } = measurementContext.measureText(zh || '')
                        const glyphTop = baseline.getBoundingClientRect().top - actualBoundingBoxAscent
                        const previousOffset = parseFloat(element.style.getPropertyValue('--wide-destination-zh-offset')) || 0
                        const offset = arrow.getBoundingClientRect().top - glyphTop + previousOffset
                        element.style.setProperty('--wide-destination-zh-offset', `${offset}px`)
                    }
                }
                return
            }

            const contentWidth = Math.max(element.scrollWidth, element.offsetWidth)
            if (!contentWidth) return

            const { paddingLeft, paddingRight } = window.getComputedStyle(container)
            const availableWidth = Math.max(
                (container.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)) *
                getInlineSafeWidthRatio(stage, isFirstStop),
                0
            )
            const scaleX = Math.min(1, availableWidth / contentWidth, getStageScaleXMax(stage, isFirstStop))
            const { min: minScaleY, max: maxScaleY } = getStageScaleYRange(stage, isFirstStop)
            const scaleY = isFirstStop && stage === 1
                ? Math.max(minScaleY, Math.min(maxScaleY, scaleX))
                : minScaleY + ((maxScaleY - minScaleY) * scaleX)

            const width = `${contentWidth * scaleX}px`
            const transform = `scale(${scaleX}, ${scaleY})`
            if (wrapper.style.width !== width) wrapper.style.width = width
            if (element.style.transform !== transform) element.style.transform = transform
        }

        fit()
        const observer = new ResizeObserver(fit)
        observer.observe(container)
        if (stage === 0 && isWide && destZhTextRef.current) {
            observer.observe(destZhTextRef.current)
        }

        // Loaded web fonts can have different ink bounds from fallback fonts.
        let disposed = false
        if (stage === 0 && isWide) {
            document.fonts.ready.then(() => {
                if (!disposed) fit()
            })
        }
        return () => {
            disposed = true
            observer.disconnect()
        }
    }, [stage, isFirstStop, zh, en, route, isWide])

    return (
        <>
            {stage === 0 && (
                <div ref={stageRef} className={`route-heading-board${isWide ? " route-heading-board--wide" : ""}`}>
                    <div className="route-heading-board__label">
                        <div className="route-heading-board__label-zh">路線</div>
                        <div className="route-heading-board__label-en">Route</div>
                    </div>
                    <div className={`route-heading-board__number${isShortRouteNumber ? " route-heading-board__number--short" : ""}`}>
                        <span ref={routeNumberRef}>{route}</span>
                    </div>
                    <div className="route-heading-board__arrows">
                        <TripleArrow
                            viewBox="0 10 180 80"
                            preserveAspectRatio="none"
                        />
                    </div>
                    {isWide ? (
                        <>
                            <div className="route-heading-board__destination route-heading-board__destination-zh">
                                <span ref={destZhTextRef} lang="zh-Hant">
                                    {zh}<i ref={destZhBaselineRef} className="route-heading-board__baseline" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="route-heading-board__destination route-heading-board__destination-en">
                                <span ref={destEnTextRef} lang="en">{en}</span>
                            </div>
                        </>
                    ) : (
                        <div className="route-heading-board__destination">
                            <div className="route-heading-board__destination-zh">
                                <span ref={destZhTextRef}>{zh}</span>
                            </div>
                            <div className="route-heading-board__destination-en">
                                <span ref={destEnTextRef}>{en}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {(stage === 1 || stage === 2) && (
                <div className={`route-heading-inline${isFirstStop ? " route-heading-inline--first-stop" : ""}${stage === 2 ? " route-heading-inline--english" : ""}${isWide ? " route-heading-inline--wide" : ""}`}>
                    <div ref={stageWrapperRef} className="route-heading-inline__wrapper">
                        <div ref={stageRef} className="route-heading-inline__content">

                            {stage === 1 && (
                                <>
                                    <div className="route-heading-inline__label">路線</div>
                                    <div className="route-heading-inline__number">{route}</div>
                                    <div className="route-heading-inline__arrows"><TripleArrow /></div>
                                    <div className="route-heading-inline__destination">{zh}</div>
                                </>
                            )}

                            {stage === 2 && (
                                <>
                                    <div className="route-heading-inline__label">Route</div>
                                    <div className="route-heading-inline__number">{route}</div>
                                    <div className="route-heading-inline__arrows"><TripleArrow /></div>
                                    <div className="route-heading-inline__destination">{en}</div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    )
})

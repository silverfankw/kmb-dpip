import { memo, useState, useEffect, useRef, useLayoutEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { TripleArrow } from "@components"
import { buildRouteSelectionKey } from '@store/storeConfig'
import "@styles/mainPanel/routeDisplayHeading.css"
import {
    HEADING_STAGE_INTERVAL,
    getInlineStageConfig,
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
    const routeKey = buildRouteSelectionKey(routeDetail)
    const stageSequence = useMemo(
        () => isFirstStop ? [1, 2] : [0, 1, 2],
        [isFirstStop]
    )

    useLayoutEffect(() => {
        setStage(isFirstStop ? 1 : 0)
    }, [isFirstStop, routeKey])

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
        }, HEADING_STAGE_INTERVAL)
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
        const destination = stage === 0 && !isWide
            ? element.querySelector('.route-heading-board__destination') : null

        const fit = () => {
            if (!container.clientWidth) return

            if (stage === 0) {
                // Layout widths ignore transforms, so measuring does not require
                // resetting styles and forcing layout between individual texts.
                const measurements = [routeNumberRef, destZhTextRef, destEnTextRef].map(ref => {
                    const text = ref.current
                    const cell = text?.parentElement
                    if (!text || !cell) return null
                    const { paddingLeft, paddingRight } = window.getComputedStyle(cell)
                    return {
                        text,
                        textWidth: Math.max(text.scrollWidth, text.offsetWidth),
                        availableWidth: Math.max(0, cell.clientWidth - (isWide
                            ? parseFloat(paddingLeft) + parseFloat(paddingRight) : 0)),
                        isDestination: ref !== routeNumberRef,
                        isEnglish: ref === destEnTextRef,
                    }
                }).filter(Boolean)
                let destinationWidth
                let justify
                if (destination) {
                    const { paddingLeft, paddingRight } = window.getComputedStyle(destination)
                    const padding = parseFloat(paddingLeft) + parseFloat(paddingRight)
                    const maxWidth = container.clientWidth * parseFloat(
                        window.getComputedStyle(element).getPropertyValue('--stage-zero-destination-max-width')
                    ) / 100
                    const textWidth = Math.max(0,
                        ...measurements.filter(item => item.isDestination).map(item => item.textWidth)
                    )
                    const width = Math.min(maxWidth, textWidth + padding)
                    destinationWidth = `${width}px`
                    justify = width < maxWidth ? 'center' : 'start'
                    for (const item of measurements) {
                        if (item.isDestination) item.availableWidth = Math.max(0, width - padding)
                    }
                }

                let chineseOffset
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
                        chineseOffset = `${arrow.getBoundingClientRect().top - glyphTop + previousOffset}px`
                    }
                }

                if (destinationWidth && element.style.getPropertyValue('--stage-zero-destination-width') !== destinationWidth) {
                    element.style.setProperty('--stage-zero-destination-width', destinationWidth)
                }
                if (justify && element.style.getPropertyValue('--stage-zero-justify') !== justify) {
                    element.style.setProperty('--stage-zero-justify', justify)
                }
                for (const { text, textWidth, availableWidth, isEnglish } of measurements) {
                    if (!textWidth || !availableWidth) continue
                    const fitScale = availableWidth / textWidth
                    const fontScale = isEnglish && fitScale < STAGE_ZERO_DEST_EN_MIN_FONT_SCALE
                        ? STAGE_ZERO_DEST_EN_MIN_FONT_SCALE : 1
                    const transform = `scale(${fontScale}) scaleX(${Math.min(fitScale, 1) / fontScale})`
                    if (text.style.transform !== transform) text.style.transform = transform
                }
                if (chineseOffset && element.style.getPropertyValue('--wide-destination-zh-offset') !== chineseOffset) {
                    element.style.setProperty('--wide-destination-zh-offset', chineseOffset)
                }
                return
            }

            const contentWidth = Math.max(element.scrollWidth, element.offsetWidth)
            if (!contentWidth) return

            const { paddingLeft, paddingRight } = window.getComputedStyle(container)
            const { safeWidthRatio, maxScaleX, minScaleY, maxScaleY } = getInlineStageConfig(stage, isFirstStop)
            const availableWidth = Math.max(
                (container.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)) *
                safeWidthRatio,
                0
            )
            const scaleX = Math.min(1, availableWidth / contentWidth, maxScaleX)
            const scaleY = isFirstStop && stage === 1
                ? Math.max(minScaleY, Math.min(maxScaleY, scaleX))
                : minScaleY + ((maxScaleY - minScaleY) * scaleX)

            const width = `${contentWidth * scaleX}px`
            const transform = `scale(${scaleX}, ${scaleY})`
            if (wrapper.style.width !== width) wrapper.style.width = width
            if (element.style.transform !== transform) element.style.transform = transform
        }

        let disposed = false
        let pendingFrame = null
        const scheduleFit = () => {
            if (disposed || pendingFrame !== null) return
            pendingFrame = requestAnimationFrame(() => {
                pendingFrame = null
                if (!disposed) fit()
            })
        }
        fit()
        const observer = new ResizeObserver(scheduleFit)
        observer.observe(container)
        if (stage === 0 && isWide && destZhTextRef.current) {
            observer.observe(destZhTextRef.current)
        }

        // Loaded web fonts can have different ink bounds from fallback fonts.
        if (stage === 0) {
            document.fonts.ready.then(scheduleFit)
        }
        return () => {
            disposed = true
            observer.disconnect()
            if (pendingFrame !== null) cancelAnimationFrame(pendingFrame)
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
                                    <div className="route-heading-inline__arrows">
                                        <TripleArrow
                                            viewBox={isWide ? "12 10 164 80" : "0 0 180 100"}
                                        />
                                    </div>
                                    <div className="route-heading-inline__destination">{zh}</div>
                                </>
                            )}

                            {stage === 2 && (
                                <>
                                    <div className="route-heading-inline__label">Route</div>
                                    <div className="route-heading-inline__number">{route}</div>
                                    <div className="route-heading-inline__arrows">
                                        <TripleArrow
                                            viewBox={isWide ? "12 10 164 80" : "0 0 180 100"}
                                        />
                                    </div>
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

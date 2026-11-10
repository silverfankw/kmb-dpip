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
const MOBILE_DESTINATION_ZH_FONT_SCALE = 0.66
const MOBILE_DESTINATION_EN_FONT_SCALE = 1

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
    const isShortRouteNumber = routeLength > 0 && routeLength <= 3

    useLayoutEffect(() => {
        const element = stageRef.current
        const wrapper = stageWrapperRef.current
        const container = stage === 0 ? element : wrapper?.parentElement
        if (!element || !container) return
        const measurementContext = stage === 0 && isWide
            ? document.createElement('canvas').getContext('2d') : null
        const destination = stage === 0 && !isWide
            ? element.querySelector('.route-heading-board__destination') : null
        const mobileLayout = window.matchMedia('(width < 48rem)')
        const inlineDestination = stage !== 0
            ? element.querySelector('.route-heading-inline__destination') : null

        const fit = () => {
            if (!container.clientWidth) return

            if (stage === 0) {
                // Layout widths ignore transforms, so measuring does not require
                // resetting styles and forcing layout between individual texts.
                const measurements = [routeNumberRef, destZhTextRef, destEnTextRef].map(ref => {
                    const text = ref.current
                    const cell = ref !== routeNumberRef && destination ? destination : text?.parentElement
                    if (!text || !cell) return null
                    const { paddingLeft, paddingRight } = window.getComputedStyle(cell)
                    return {
                        text,
                        textWidth: Math.max(text.scrollWidth, text.offsetWidth),
                        availableWidth: Math.max(0, cell.clientWidth -
                            parseFloat(paddingLeft) - parseFloat(paddingRight)),
                        isEnglish: ref === destEnTextRef,
                    }
                }).filter(Boolean)

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

            if (inlineDestination) {
                inlineDestination.style.fontSize = ''
                inlineDestination.style.transform = ''
            }

            if (!isWide && mobileLayout.matches && inlineDestination?.textContent) {
                element.style.transform = 'none'
                wrapper.style.width = ''
                const containerStyle = window.getComputedStyle(container)
                const availableWidth = Math.max(0, container.clientWidth -
                    parseFloat(containerStyle.paddingLeft) - parseFloat(containerStyle.paddingRight)) * 0.985
                const availableHeight = Math.max(0, container.clientHeight -
                    parseFloat(containerStyle.paddingTop) - parseFloat(containerStyle.paddingBottom)) * 0.985
                if (!availableWidth || !availableHeight) return
                const fixedWidth = element.getBoundingClientRect().width - inlineDestination.getBoundingClientRect().width
                const scale = Math.min(1, availableWidth / (fixedWidth + 1))
                const destinationWidth = Math.max(0, availableWidth / scale - fixedWidth)
                const destinationHeight = availableHeight / scale
                let minSize = 0
                let maxSize = destinationHeight
                for (let iteration = 0; iteration < 16; iteration++) {
                    const size = (minSize + maxSize) / 2
                    inlineDestination.style.fontSize = `${size}px`
                    const bounds = inlineDestination.getBoundingClientRect()
                    if (bounds.width <= destinationWidth && bounds.height <= destinationHeight) {
                        minSize = size
                    } else {
                        maxSize = size
                    }
                }
                const fontScale = stage === 1
                    ? MOBILE_DESTINATION_ZH_FONT_SCALE : MOBILE_DESTINATION_EN_FONT_SCALE
                inlineDestination.style.fontSize = `${Math.floor(minSize * fontScale * 10) / 10}px`
                const textHeight = inlineDestination.getBoundingClientRect().height
                const scaleY = textHeight > 0
                    ? Math.min(1.12, destinationHeight * fontScale / textHeight) : 1
                inlineDestination.style.transform = `scaleY(${scaleY})`
                wrapper.style.width = `${element.getBoundingClientRect().width * scale}px`
                element.style.transform = `scale(${scale})`
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
        mobileLayout.addEventListener('change', scheduleFit)
        if (stage === 0 && isWide && destZhTextRef.current) {
            observer.observe(destZhTextRef.current)
        }

        // Loaded web fonts can have different ink bounds from fallback fonts.
        document.fonts.ready.then(scheduleFit)
        return () => {
            disposed = true
            observer.disconnect()
            mobileLayout.removeEventListener('change', scheduleFit)
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
                            steep
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

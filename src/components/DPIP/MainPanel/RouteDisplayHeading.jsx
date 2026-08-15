import { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { TripleArrow } from "@components"
import {
    STAGE_DURATIONS,
    getInlineSafeWidthRatio,
    getStageScaleYRange,
    getStageScaleXMax,
} from './mainPanelConfig'


// Tailwind CSS classes for the component
const styles = {
    routeMarkerContainer: [
        "flex flex-col",
        "basis-[10%]",
        "text-center",
        "items-center",
        "min-w-max",
        "shrink-0",
    ].join(" "),

    routeMarkerZh: [
        "text-[3.5cqw]",
        "tracking-tighter",
    ].join(" "),

    routeMarkerEn: [
        "text-[3.25cqw]",
        "tracking-tighter",
        "leading-none",
    ].join(" "),

    routeNumber: [
        "basis-[17.5%]",
        "text-[6.5cqw] max-sm:text-[6cqw]",
        "text-center",
        "scale-y-115 max-sm:scale-y-120",
    ].join(" "),

    routeNumberInline: [
        "text-[6cqw]",
        "text-center",
        "scale-y-120",
        "shrink-0",
        "self-center",
        "ml-1 mr-1",
        "max-sm:tracking-tight",
    ].join(" "),

    routeNumberInlineFirstStopStage1: [
        "text-[5cqw]",
        "text-center",
        "scale-y-110",
        "shrink-0",
        "self-center",
        "ml-1 mr-1",
        "max-sm:tracking-tight",
    ].join(" "),

    arrowContainer: [
        "flex",
        "items-center",
        "basis-[12%]",
        "max-xl:basis-[4rem]",
        "max-sm:basis-[2.5rem]",
        "justify-center"
    ].join(" "),

    arrowContainerSm: [
        "flex",
        "items-center",
        "basis-[6%]",
        "max-xl:basis-[2rem]",
        "max-sm:basis-[1.5rem]",
        "justify-center"
    ].join(" "),

    arrowContainerInline: [
        "flex",
        "items-center",
        "w-[9cqw]",
        "shrink-0",
        "justify-center",
    ].join(" "),

    arrowContainerSmInline: [
        "flex",
        "items-center",
        "w-[8cqw]",
        "shrink-0",
        "justify-center",
        "ml-1",
    ].join(" "),

    arrowContainerSmInlineFirstStopStage1: [
        "flex",
        "items-center",
        "w-[9cqw] max-sm:w-[8cqw]",
        "shrink-0",
        "justify-center",
    ].join(" "),

    destContainer: [
        "flex flex-col",
        "mr-0.5",
        "whitespace-nowrap",
        "overflow-hidden",
        "text-ellipsis",
    ].join(" "),

    destZh: [
        "whitespace-nowrap",
        "text-[4.375cqw] max-md:text-[4.375cqw] max-sm:text-[4.75cqw]",
        "max-sm:tracking-normal",
    ].join(" "),

    destEn: [
        "mb-[2px]",
        "text-[2.625cqw] max-sm:text-[2.75cqw]",
        "leading-tight",
    ].join(" "),

    // Inline (single-language) variants
    markerZhInline: [
        "tracking-tighter",
        "text-[4cqw] max-md:text-[4.25cqw]",
        "shrink-0",
        "mr-1"
    ].join(" "),

    markerZhInlineFirstStopStage1: [
        "tracking-tighter",
        "text-[3.5cqw] max-md:text-[3.75cqw]",
        "shrink-0",
        "mr-1"
    ].join(" "),

    markerEnInline: [
        "tracking-tighter",
        "text-[4cqw] max-sm:text-[4.5cqw]",
        "shrink-0",
    ].join(" "),

    destZhInline: [
        "whitespace-nowrap",
        "text-[5.5cqw] max-sm:text-[5.25cqw]",
    ].join(" "),

    destZhInlineFirstStopStage1: [
        "whitespace-nowrap",
        "text-[5cqw] max-sm:text-[4.8cqw]",
    ].join(" "),

    destEnInline: [
        "whitespace-nowrap",
        "text-[4.5cqw] max-sm:text-[3.75cqw]",
    ].join(" "),
}

export const RouteDisplayHeading = () => {

    const { routeDetail, lastStopIndex, currentStopIndex } = useSelector(state => state.routeSelection)
    const [stage, setStage] = useState(0)
    const stageRef = useRef(null)
    const stageWrapperRef = useRef(null)
    const isFirstStop = routeDetail?.stops?.length > 0 && currentStopIndex === 0
    const isFirstStopStage1 = isFirstStop && stage === 1
    const stageSequence = useMemo(() => isFirstStop ? [1, 2] : [0, 1, 2], [isFirstStop])

    useEffect(() => {
        setStage(isFirstStop ? 1 : 0)
    }, [isFirstStop, routeDetail?.route, routeDetail?.bound, routeDetail?.service_type])

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

    const applyScale = useCallback(() => {
        const el = stageRef.current
        if (!el) return

        const wrapper = stageWrapperRef.current
        const container = wrapper?.parentElement ?? el.parentElement
        if (!container || !container.clientWidth) return

        const previousTransform = el.style.transform
        const previousWrapperWidth = wrapper?.style.width ?? ""

        if (wrapper && previousWrapperWidth) {
            wrapper.style.width = ""
        }
        if (previousTransform) {
            el.style.transform = "scale(1)"
        }

        const elementStyle = window.getComputedStyle(el)
        const contentGap = parseFloat(elementStyle.columnGap || elementStyle.gap || '0')
        const children = Array.from(el.children)
        const contentWidth = children.length > 0
            ? Math.max(
                el.scrollWidth,
                children.reduce((sum, child) => {
                    const childStyle = window.getComputedStyle(child)
                    const horizontalMargins =
                        parseFloat(childStyle.marginLeft || '0') +
                        parseFloat(childStyle.marginRight || '0')

                    return sum + Math.max(child.scrollWidth, child.offsetWidth) + horizontalMargins
                }, 0) + (contentGap * Math.max(children.length - 1, 0))
            )
            : Math.max(el.scrollWidth, el.offsetWidth)
        if (!contentWidth) {
            if (wrapper && wrapper.style.width !== previousWrapperWidth) {
                wrapper.style.width = previousWrapperWidth
            }
            if (el.style.transform !== previousTransform) {
                el.style.transform = previousTransform
            }
            return
        }
        const containerStyle = window.getComputedStyle(container)
        const horizontalPadding =
            parseFloat(containerStyle.paddingLeft || '0') +
            parseFloat(containerStyle.paddingRight || '0')
        const safeWidthRatio = stage === 0 ? 1 : getInlineSafeWidthRatio(stage, isFirstStop)
        const availableWidth = Math.max(
            (container.clientWidth - horizontalPadding) * safeWidthRatio,
            0
        )
        const scaleX = Math.min(1, availableWidth / contentWidth, getStageScaleXMax(stage, isFirstStop))
        const { min: minScaleY, max: maxScaleY } = getStageScaleYRange(stage, isFirstStop)
        const scaleY = stage === 0
            ? Math.max(minScaleY, Math.min(maxScaleY, scaleX))
            : isFirstStopStage1
                ? Math.max(minScaleY, Math.min(maxScaleY, scaleX))
            : minScaleY + ((maxScaleY - minScaleY) * scaleX)

        if (wrapper) {
            const nextWidth = `${Math.max(contentWidth * scaleX, 0)}px`
            if (wrapper.style.width !== nextWidth) {
                wrapper.style.width = nextWidth
            }
        }

        const nextTransform = `scale(${scaleX}, ${scaleY})`
        if (el.style.transform !== nextTransform) {
            el.style.transform = nextTransform
        }
    }, [isFirstStop, isFirstStopStage1, stage])

    useLayoutEffect(() => {
        applyScale()
    }, [stage, zh, en, route, applyScale])

    useEffect(() => {
        const container = stageWrapperRef.current?.parentElement ?? stageRef.current?.parentElement
        if (!container) return
        const ro = new ResizeObserver(applyScale)
        ro.observe(container)
        return () => ro.disconnect()
    }, [stage, applyScale])

    return (
        <>
            {stage === 0 && (
                <div ref={stageRef} className="flex-1 min-w-0 flex items-center gap-1">
                    <div className={styles.routeMarkerContainer}>
                        <div className={styles.routeMarkerZh}>路線</div>
                        <div className={styles.routeMarkerEn}>Route</div>
                    </div>
                    <div className={styles.routeNumber}>{route}</div>
                    <div className={styles.arrowContainer}><TripleArrow /></div>
                    <div className={styles.destContainer}>
                        <div className={styles.destZh}>{zh}</div>
                        <div className={styles.destEn}>{en}</div>
                    </div>
                </div>
            )}

            {(stage === 1 || stage === 2) && (
                <div className={`flex-1 min-w-0 h-full flex items-center justify-center overflow-hidden ${stage === 2 && !isFirstStop ? "px-2" : ""}`}>
                    <div ref={stageWrapperRef} className="flex justify-center">
                        <div ref={stageRef} className="inline-flex shrink-0 items-center gap-2">

                            {stage === 1 && (
                                <>
                                    <div className={isFirstStopStage1 ? styles.markerZhInlineFirstStopStage1 : styles.markerZhInline}>路線</div>
                                    <div className={isFirstStopStage1 ? styles.routeNumberInlineFirstStopStage1 : styles.routeNumberInline}>{route}</div>
                                    <div className={isFirstStopStage1 ? styles.arrowContainerSmInlineFirstStopStage1 : styles.arrowContainerSmInline}><TripleArrow /></div>
                                    <div className={isFirstStopStage1 ? styles.destZhInlineFirstStopStage1 : styles.destZhInline}>{zh}</div>
                                </>
                            )}

                            {stage === 2 && (
                                <>
                                    <div className={styles.markerEnInline}>Route</div>
                                    <div className={styles.routeNumberInline}>{route}</div>
                                    <div className={styles.arrowContainerInline}><TripleArrow /></div>
                                    <div className={styles.destEnInline}>{en}</div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
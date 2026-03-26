import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { TripleArrow } from "@components"

// Stage durations in ms: [bilingual, chinese-only, english-only]
const STAGE_DURATIONS = [4500, 4500, 4500]


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
        "font-[500]",
        "tracking-tighter",
        "text-[4cqw]",
        "max-sm:text-[4cqw]",
    ].join(" "),

    routeMarkerEn: [
        "tracking-tighter",
        "text-[2.75cqw]",
        "max-sm:text-[3cqw]"
    ].join(" "),

    routeNumber: [
        "basis-[17.5%]",
        "font-[500]",
        "text-[6.75cqw]",
        "text-center",
        "scale-y-120",
    ].join(" "),

    routeNumberInline: [
        "font-[500]",
        "text-[6cqw]",
        "text-center",
        "scale-y-120",
        "shrink-0",
        "self-center",
        "ml-1 mr-1"
    ].join(" "),

    arrowContainer: [
        "flex",
        "items-center",
        "basis-[10%]",
        "max-xl:basis-[3.25rem]",
        "max-sm:basis-[2rem]",
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
        "w-[7cqw]",
        "shrink-0",
        "justify-center",
    ].join(" "),

    arrowContainerSmInline: [
        "flex",
        "items-center",
        "w-[6cqw]",
        "shrink-0",
        "justify-center",
        "ml-1",
    ].join(" "),

    destContainer: [
        "flex flex-col",
        "mr-0.5",
    ].join(" "),

    destZh: [
        "font-[500]",
        "whitespace-nowrap",
        "text-[4.375cqw]",
        "max-md:text-[4.375cqw]",
        "max-sm:text-[5cqw]",
        "tracking-wide",
        "max-sm:tracking-normal",
    ].join(" "),

    destEn: [
        "font-[500]",
        "text-sm",
        "whitespace-nowrap",
        "text-[2.5cqw]",
        "max-sm:text-[2.625cqw]",
    ].join(" "),

    // Inline (single-language) variants
    markerZhInline: [
        "font-[500]",
        "tracking-tighter",
        "text-[3.5cqw]",
        "shrink-0",
        "mr-1"
    ].join(" "),

    markerEnInline: [
        "tracking-tighter",
        "text-[3.5cqw]",
        "shrink-0",
    ].join(" "),

    destZhInline: [
        "font-[500]",
        "whitespace-nowrap",
        "text-[5.5cqw]",
        "tracking-tight",
    ].join(" "),

    destEnInline: [
        "font-[500]",
        "whitespace-nowrap",
        "text-[4.5cqw]",
        "tracking-tight",
    ].join(" "),
}

export const RouteDisplayHeading = () => {

    const { routeDetail, lastStopIndex } = useSelector(state => state.routeSelection)
    const [stage, setStage] = useState(0)
    const stageRef = useRef(null)

    useEffect(() => {
        const t = setTimeout(() => setStage(s => (s + 1) % 3), STAGE_DURATIONS[stage])
        return () => clearTimeout(t)
    }, [stage])

    const zh = routeDetail?.stops?.[lastStopIndex]?.zh
    const en = routeDetail?.stops?.[lastStopIndex]?.en
    const route = routeDetail.route

    const applyScale = useCallback(() => {
        const el = stageRef.current
        if (!el) return
        const container = el.parentElement
        if (!container || !container.clientWidth) return
        el.style.transform = 'scale(1)'
        const naturalWidth = el.offsetWidth
        if (!naturalWidth) return
        const targetWidth = container.clientWidth * (stage === 1 ? 0.75 : 0.95)
        const scale = Math.min(1.1, targetWidth / naturalWidth)
        el.style.transform = `scale(${scale})`
    }, [stage])

    useLayoutEffect(() => {
        if (stage === 0) return
        applyScale()
    }, [stage, zh, en, route, applyScale])

    useEffect(() => {
        if (stage === 0) return
        const container = stageRef.current?.parentElement
        if (!container) return
        const ro = new ResizeObserver(applyScale)
        ro.observe(container)
        return () => ro.disconnect()
    }, [stage, applyScale])

    return (
        <>
            {stage === 0 && (
                <div className="flex-1 flex items-center gap-2">
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
                <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
                    <div ref={stageRef} className="inline-flex items-center gap-2">

                        {stage === 1 && (
                            <>
                                <div className={styles.markerZhInline}>路線</div>
                                <div className={styles.routeNumberInline}>{route}</div>
                                <div className={styles.arrowContainerSmInline}><TripleArrow /></div>
                                <div className={styles.destZhInline}>{zh}</div>
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
            )}
        </>
    )
}
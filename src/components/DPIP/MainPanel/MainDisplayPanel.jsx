import '@styles/App.css'
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { useSelector } from "react-redux"
import stringWidth from "string-width"
import { useToggleDisplay } from "@hooks"

import { LoadingSpinner } from '@components'
import {
    RouteDisplayHeading,
    HoldHandrailNotice,
    MindDoorNotice,
    StopFullProgressBar,
    StopCompactProgressBar
} from '@components/DPIP'

// --- Constants ---
const progressBarInterval = 11000
const stopNameInterval = 4500
const FIRST_STOP_WELCOME_ZH = "歡迎乘搭九龍巴士"
const FIRST_STOP_WELCOME_EN = "WELCOME ABOARD"
const STOP_NAME_ZH_SAFE_WIDTH_RATIO = 0.985

const getStopNameZhBaseFontSize = (text) => {
    const visualLength = Math.max(stringWidth(text || ""), 1)
    return Math.max(10.25, Math.min(10.5, 13.5 - (Math.max(visualLength - 6, 0) * 0.3)))
}

// --- Styles outside component ---
const basestyles = {
    parentGrid: [
        "select-none",
        "grid",
        "grid-cols-[0.25fr_1fr]",
        "grid-rows-[0.5fr_1.85fr_0.0375fr_1fr_0.125fr]"
    ].join(" "),

    nextStopIndicatorGrid: [
        "@container",
        "col-start-1 col-end-2",
        "h-full",
        "flex flex-col gap-2 max-sm:gap-1 items-center justify-center",
        "text-center",
        "leading-none",
    ].join(" "),

    nextStopIndicatorZh: [
        "text-[18cqw]",
    ].join(" "),

    nextStopIndicatorEn: [
        "text-[10cqw]",
    ].join(" "),

    routeHeadingGrid: [
        "@container",
        "flex items-center gap-1",
        "pl-0.5",
        "bg-black text-white"
    ].join(" "),

    routeHeadingGridDefault: "col-start-2 col-end-5",

    routeHeadingGridFirstStop: "col-start-1 col-end-3",

    stopProgressBarGrid: [
        "@container",
        "col-start-1 col-end-5",
        "bg-white"
    ].join(" "),

    stopProgressBarContainer: [
        "h-full",
        "font-semibold",
        "text-center",
        "tracking-tight"
    ].join(" "),

    dividerGrid: [
        "col-start-1 col-end-5",
        "bg-black"
    ].join(" "),

    stopNameGrid: [
        "@container",
        "col-start-1 col-end-5",
        "bg-white",
        "text-black",
        "flex justify-center items-center",
    ].join(" "),

    stopNameZh: [
        "inline-block",
        "shrink-0",
        "whitespace-nowrap"
    ].join(" "),

    stopNameEn: [
        "text-center",
        "text-[5cqw]",
        "max-sm:text-[4cqw]",
        "max-md:text-[5cqw]",
    ].join(" "),

    driverInfoGrid: [
        "@container",
        "flex justify-center",
        "col-start-1 col-end-5",
        "text-white tracking-tight",
        "p-0.5"
    ].join(" "),

    driverInfoText: [
        "text-[2.05cqw]",
        "max-sm:text-[2.15cqw]"
    ].join(" "),

    capitalize: "capitalize",

    noticeZhOverrideStyle: "!text-[8cqw]",

    noticeEnOverrideStyle: "!text-[3.75cqw]"
}

export const MainDisplayPanel = ({ monitorStyle, screenTarget }) => {

    const {
        routeDetail,
        currentStopIndex,
        isLoading,
    } = useSelector(state => state.routeSelection)

    const {
        showHandrailNotice,
        showMindDoorNotice,
        stopPressed,
        driverInfo
    } = useSelector(state => state.userPreference)

    const isFirstStop = routeDetail?.stops?.length > 0 && currentStopIndex === 0
    const stopNameZh = isFirstStop
        ? FIRST_STOP_WELCOME_ZH
        : routeDetail?.stops?.[currentStopIndex]?.zh
    const stopNameEn = isFirstStop
        ? FIRST_STOP_WELCOME_EN
        : routeDetail?.stops?.[currentStopIndex]?.en

    const fullProgressBarRef = useRef(null)
    const compactProgressBarRef = useRef(null)
    const stopNameGridRef = useRef(null)
    const zhStopNameRef = useRef(null)
    const enStopNameRef = useRef(null)

    const applyStopNameZhScale = useCallback(() => {
        const container = stopNameGridRef.current
        const el = zhStopNameRef.current

        if (!container || !el || el.style.display === "none") return

        const contentWidth = el.scrollWidth
        if (!contentWidth) return

        const containerStyle = window.getComputedStyle(container)
        const horizontalPadding =
            parseFloat(containerStyle.paddingLeft || "0") +
            parseFloat(containerStyle.paddingRight || "0")
        const availableWidth = Math.max(
            ((container.clientWidth - horizontalPadding) * STOP_NAME_ZH_SAFE_WIDTH_RATIO),
            0
        )
        const scaleX = Math.min(1, availableWidth / contentWidth)

        const nextTransform = `scaleX(${scaleX})`
        if (el.style.transform !== nextTransform) {
            el.style.transform = nextTransform
        }
    }, [])

    // Toggle progress bar and stop name display
    useToggleDisplay(fullProgressBarRef, compactProgressBarRef, progressBarInterval, [routeDetail?.route, routeDetail?.bound, routeDetail?.service_type])
    useToggleDisplay(zhStopNameRef, enStopNameRef, stopNameInterval, [routeDetail?.route, routeDetail?.bound, routeDetail?.service_type])

    // Reset stop name display when notice toggles change
    useEffect(() => {
        let animationFrameId = null

        if (isFirstStop) {
            zhStopNameRef.current && (zhStopNameRef.current.style.display = "block")
            enStopNameRef.current && (enStopNameRef.current.style.display = "none")
            animationFrameId = window.requestAnimationFrame(applyStopNameZhScale)
            return () => window.cancelAnimationFrame(animationFrameId)
        }

        if (showHandrailNotice || showMindDoorNotice) {
            zhStopNameRef.current && (zhStopNameRef.current.style.display = "none")
            enStopNameRef.current && (enStopNameRef.current.style.display = "none")
        } else {
            zhStopNameRef.current && (zhStopNameRef.current.style.display = "block")
            enStopNameRef.current && (enStopNameRef.current.style.display = "none")
            animationFrameId = window.requestAnimationFrame(applyStopNameZhScale)
        }

        return () => {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [applyStopNameZhScale, isFirstStop, showHandrailNotice, showMindDoorNotice])

    useLayoutEffect(() => {
        applyStopNameZhScale()
    }, [applyStopNameZhScale, stopNameZh])

    useEffect(() => {
        const container = stopNameGridRef.current
        if (!container) return

        const ro = new ResizeObserver(applyStopNameZhScale)
        ro.observe(container)
        return () => ro.disconnect()
    }, [applyStopNameZhScale])

    // Compose dynamic classes
    const styles = {
        ...basestyles,
        parentGrid: `${basestyles.parentGrid} ${monitorStyle}`,
        nextStopIndicatorGrid: `${basestyles.nextStopIndicatorGrid} ${stopPressed ? "bg-[#FF0000] text-white" : "bg-[#FFFF00] text-black"}`,
        routeHeadingGrid: `${basestyles.routeHeadingGrid} ${isFirstStop ? basestyles.routeHeadingGridFirstStop : basestyles.routeHeadingGridDefault}`,
        driverInfoGrid: `${basestyles.driverInfoGrid} ${stopPressed ? "bg-[#FF0000]" : "bg-black"}`
    }

    return (
        <div ref={screenTarget} className={styles.parentGrid}>
            {/* Next stop Indicator */}
            {!isFirstStop && (
                <div className={styles.nextStopIndicatorGrid}>
                    <div className={styles.nextStopIndicatorZh}>
                        下一站{stopPressed && `停於`}
                    </div>
                    <div className={styles.nextStopIndicatorEn}>
                        Next {stopPressed ? `Stopping at` : `Stop`}
                    </div>
                </div>
            )}

            {/* Route Number & Destination */}
            <div className={styles.routeHeadingGrid}>
                <RouteDisplayHeading />
            </div>

            {/* Progress Bar (only if stops exist) */}
            <div className={styles.stopProgressBarGrid}>
                {isLoading ? (<LoadingSpinner />) :
                    routeDetail?.stops?.length > 0 && (
                        <div className={styles.stopProgressBarContainer}>
                            <StopFullProgressBar progressBarRef={fullProgressBarRef} />
                            <StopCompactProgressBar progressBarRef={compactProgressBarRef} />
                        </div>
                    )}
            </div>

            {/* Divider */}
            <div className={styles.dividerGrid}></div>

            {/* Big next stop name */}
            <div ref={stopNameGridRef} className={styles.stopNameGrid}>
                {isFirstStop ? (
                    <>
                        <span
                            ref={zhStopNameRef}
                            className={styles.stopNameZh}
                            style={{
                                fontSize: `${getStopNameZhBaseFontSize(stopNameZh)}cqw`,
                                transformOrigin: "center center"
                            }}
                        >
                            {stopNameZh}
                        </span>
                        <span
                            ref={enStopNameRef}
                            className={styles.stopNameEn}
                        >
                            {stopNameEn}
                        </span>
                    </>
                ) : showHandrailNotice ? (
                    <HoldHandrailNotice
                        zhNameOverrideStyle={styles.noticeZhOverrideStyle}
                        enNameOverrideStyle={styles.noticeEnOverrideStyle}
                    />
                ) : showMindDoorNotice ? (
                    <MindDoorNotice
                        zhNameOverrideStyle={styles.noticeZhOverrideStyle}
                        enNameOverrideStyle={styles.noticeEnOverrideStyle}
                    />
                ) : (
                    <>
                        <span
                            ref={zhStopNameRef}
                            className={styles.stopNameZh}
                            style={{
                                fontSize: `${getStopNameZhBaseFontSize(stopNameZh)}cqw`,
                                transformOrigin: "center center"
                            }}
                        >
                            {stopNameZh}
                        </span>
                        <span
                            ref={enStopNameRef}
                            className={styles.stopNameEn}
                        >
                            {stopNameEn}
                        </span>
                    </>
                )}
            </div>

            {/* Driver Info */}
            <div className={styles.driverInfoGrid}>
                <span className={styles.driverInfoText}>
                    {driverInfo?.nameZh}車長正為您服務 &nbsp; Bus Captain&nbsp;
                </span>
                <span className={`${styles.driverInfoText} ${styles.capitalize}`}>
                    {driverInfo?.nameEn}&nbsp;
                </span>
                <span className={styles.driverInfoText}>
                    is serving you &nbsp;&nbsp;員工編號 &nbsp;Staff No.: {driverInfo?.staffNo}
                </span>
            </div>
        </div>
    )
}

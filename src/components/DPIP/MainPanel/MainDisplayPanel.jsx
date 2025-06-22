import '@css/App.css'
import { useEffect, useRef } from "react"
import { useToggleDisplay } from "@hooks"
import { useSelector } from "react-redux"
import stringWidth from "string-width"

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

// --- Styles outside component ---
const basestyles = {
    parentGrid: "select-none grid grid-rows-[0.5fr_1.85fr_0.0375fr_1fr_0.125fr]",
    nextStopIndicatorGrid: "@container col-start-1 col-end-2 flex flex-col text-center items-center justify-center",
    nextStopIndicatorZh: "max-sm:text-[16cqw] text-[15cqw] mb-[-4px] font-[600]",
    nextStopIndicatorEn: "max-sm:text-[9cqw] text-[7.5cqw] font-[400]",
    routeHeadingGrid: "@container col-start-2 col-end-5 flex items-center pl-1 bg-black text-white",
    stopProgressBarGrid: "@container col-start-1 col-end-5 bg-white",
    stopProgressBarContainer: "relative top-[87.5%] font-[400] text-center tracking-tight",
    dividerGrid: "col-start-1 col-end-5 bg-black",
    stopNameGrid: "@container col-start-1 col-end-5 bg-white flex justify-center items-center",
    stopNameZh: "font-[500] max-sm:text-[8.5cqw] max-md:text-[10cqw] text-[8cqw] whitespace-nowrap overflow-hidden",
    stopNameEn: "text-center font-[500] max-sm:text-[4cqw] max-md:text-[5cqw] text-[5cqw]",
    driverInfoGrid: "@container flex justify-center col-start-1 col-end-5 font-extralight text-white p-1",
    driverInfoText: "text-[2cqw] max-md:text-[2.25cqw]",
    capitalize: "capitalize",
    noticeZhOverrideStyle: "!text-[8cqw]",
    noticeEnOverrideStyle: "!text-[3.75cqw]",
}

// --- Helper for dynamic stop name font size ---
const getClampTextStyle = (text) => {
    const visualLength = stringWidth(text || "")
    return `clamp(2rem, ${Math.max(16 - visualLength * 0.45, 4.5)}cqw, 8.5cqw)`
}

export const MainDisplayPanel = ({ monitorStyle, screenTarget }) => {

    const { routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
    const {
        showHandrailNotice,
        showMindDoorNotice,
        stopPressed,
        driverInfo
    } = useSelector(state => state.userPreference)

    const stopNameZh = routeDetail?.stops?.[currentStopIndex]?.zh
    const stopNameEn = routeDetail?.stops?.[currentStopIndex]?.en

    const fullProgressBarRef = useRef(null)
    const compactProgressBarRef = useRef(null)
    const zhStopNameRef = useRef(null)
    const enStopNameRef = useRef(null)

    // Toggle progress bar and stop name display
    useToggleDisplay(fullProgressBarRef, compactProgressBarRef, progressBarInterval, [routeDetail?.route, routeDetail?.bound, routeDetail?.service_type])
    useToggleDisplay(zhStopNameRef, enStopNameRef, stopNameInterval, [routeDetail?.route, routeDetail?.bound, routeDetail?.service_type])

    // Reset stop name display when notice toggles change
    useEffect(() => {
        if (showHandrailNotice || showMindDoorNotice) {
            zhStopNameRef.current && (zhStopNameRef.current.style.display = "none")
            enStopNameRef.current && (enStopNameRef.current.style.display = "none")
        } else {
            zhStopNameRef.current && (zhStopNameRef.current.style.display = "block")
            enStopNameRef.current && (enStopNameRef.current.style.display = "none")
        }
    }, [showHandrailNotice, showMindDoorNotice])

    // Compose dynamic classes
    const styles = {
        ...basestyles,
        parentGrid: `${basestyles.parentGrid} ${monitorStyle}`,
        nextStopIndicatorGrid: `${basestyles.nextStopIndicatorGrid} ${stopPressed ? "bg-[#FF0000] text-white" : "bg-[#FFFF00] text-black"}`,
        driverInfoGrid: `${basestyles.driverInfoGrid} ${stopPressed ? "bg-[#FF0000]" : "bg-black"}`
    }

    return (
        <div ref={screenTarget} className={styles.parentGrid}>
            {/* Next stop Indicator */}
            <div className={styles.nextStopIndicatorGrid}>
                <div className={styles.nextStopIndicatorZh}>
                    下一站{stopPressed && `停於`}
                </div>
                <div className={styles.nextStopIndicatorEn}>
                    Next {stopPressed ? `Stopping at` : `Stop`}
                </div>
            </div>

            {/* Route Number & Destination */}
            <div className={styles.routeHeadingGrid}>
                <RouteDisplayHeading />
            </div>

            {/* Progress Bar (only if stops exist) */}
            <div className={styles.stopProgressBarGrid}>
                {routeDetail?.stops?.length > 0 && (
                    <div className={styles.stopProgressBarContainer}>
                        <StopFullProgressBar progressBarRef={fullProgressBarRef} />
                        <StopCompactProgressBar progressBarRef={compactProgressBarRef} />
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className={styles.dividerGrid}></div>

            {/* Big next stop name */}
            <div className={styles.stopNameGrid}>
                {showHandrailNotice ? (
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
                            style={{ fontSize: getClampTextStyle(stopNameZh) }}
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
                    is serving you &nbsp;&nbsp;員工編號 &nbsp;Emp. No: {driverInfo?.staffNo}
                </span>
            </div>
        </div>
    )
}


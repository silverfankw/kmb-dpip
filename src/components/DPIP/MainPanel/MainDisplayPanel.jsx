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
const baseStyleClasses = {
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

export const MainDisplayPanel = ({
    monitorStyleOptions,
    screenTarget
}) => {

    const { routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
    const {
        showHandrailNotice,
        showMindDoorNotice,
        monitorStyle,
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
    const styleClasses = {
        ...baseStyleClasses,
        parentGrid: `${baseStyleClasses.parentGrid} ${monitorStyleOptions[monitorStyle]}`,
        nextStopIndicatorGrid: `${baseStyleClasses.nextStopIndicatorGrid} ${stopPressed ? "bg-[#FF0000] text-white" : "bg-[#FFFF00] text-black"}`,
        driverInfoGrid: `${baseStyleClasses.driverInfoGrid} ${stopPressed ? "bg-[#FF0000]" : "bg-black"}`
    }

    return (
        <div ref={screenTarget} className={styleClasses.parentGrid}>
            {/* Next stop Indicator */}
            <div className={styleClasses.nextStopIndicatorGrid}>
                <div className={styleClasses.nextStopIndicatorZh}>
                    下一站{stopPressed && `停於`}
                </div>
                <div className={styleClasses.nextStopIndicatorEn}>
                    Next {stopPressed ? `Stopping at` : `Stop`}
                </div>
            </div>

            {/* Route Number & Destination */}
            <div className={styleClasses.routeHeadingGrid}>
                <RouteDisplayHeading />
            </div>

            {/* Progress Bar (only if stops exist) */}
            <div className={styleClasses.stopProgressBarGrid}>
                {routeDetail?.stops?.length > 0 && (
                    <div className={styleClasses.stopProgressBarContainer}>
                        <StopFullProgressBar progressBarRef={fullProgressBarRef} />
                        <StopCompactProgressBar progressBarRef={compactProgressBarRef} />
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className={styleClasses.dividerGrid}></div>

            {/* Big next stop name */}
            <div className={styleClasses.stopNameGrid}>
                {showHandrailNotice ? (
                    <HoldHandrailNotice
                        zhNameOverrideStyle={styleClasses.noticeZhOverrideStyle}
                        enNameOverrideStyle={styleClasses.noticeEnOverrideStyle}
                    />
                ) : showMindDoorNotice ? (
                    <MindDoorNotice
                        zhNameOverrideStyle={styleClasses.noticeZhOverrideStyle}
                        enNameOverrideStyle={styleClasses.noticeEnOverrideStyle}
                    />
                ) : (
                    <>
                        <span
                            ref={zhStopNameRef}
                            className={styleClasses.stopNameZh}
                            style={{ fontSize: getClampTextStyle(stopNameZh) }}
                        >
                            {stopNameZh}
                        </span>
                        <span
                            ref={enStopNameRef}
                            className={styleClasses.stopNameEn}
                        >
                            {stopNameEn}
                        </span>
                    </>
                )}
            </div>

            {/* Driver Info */}
            <div className={styleClasses.driverInfoGrid}>
                <span className={styleClasses.driverInfoText}>
                    {driverInfo?.nameZh}車長正為您服務 &nbsp; Bus Captain&nbsp;
                </span>
                <span className={`${styleClasses.driverInfoText} ${styleClasses.capitalize}`}>
                    {driverInfo?.nameEn}&nbsp;
                </span>
                <span className={styleClasses.driverInfoText}>
                    is serving you &nbsp;&nbsp;員工編號 &nbsp;Emp. No: {driverInfo?.staffNo}
                </span>
            </div>
        </div>
    )
}


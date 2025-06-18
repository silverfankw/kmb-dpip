import './App.css'
import { useEffect, useRef } from "react"
import {
    RouteDisplayHeading,
    HoldHandrailNotice,
    MindDoorNotice,
    StopFullProgressBar,
    StopCompactProgressBar
} from './component'

// Constants for intervals milliseconds
const progressBarInterval = 11000
const stopNameInterval = 4500

{/* DPIP main screen with full details */ }
export const DPIPMainScreen = ({
    detail,
    currentStopIndex,
    userPreference: {
        monitorStyle,
        stopPressed,
        driverInfo,
        mindDoorNotice,
        handrailNotice
    },
    monitorStyleOptions,
    screenTarget }) => {

    // Ensure detail and stops are defined
    const stopNameZh = detail?.stops?.[currentStopIndex]?.zh
    const stopNameEn = detail?.stops?.[currentStopIndex]?.en

    // Refs for toggling visibility of elements
    const fullProgressBarRef = useRef(null)
    const compactProgressBarRef = useRef(null)
    const zhStopNameRef = useRef(null)
    const enStopNameRef = useRef(null)

    // Display toggles setup
    useEffect(() => {
        // Helper to toggle display between two refs
        const toggleDisplay = (refA, refB) => {
            if (refA.current && refB.current) {
                const isAVisible = refA.current.style.display !== "none"
                refA.current.style.display = isAVisible ? "none" : "block"
                refB.current.style.display = isAVisible ? "block" : "none"
            }
        }

        if (fullProgressBarRef.current && compactProgressBarRef.current) {
            fullProgressBarRef.current.style.display = "block"
            compactProgressBarRef.current.style.display = "none"
        }
        if (zhStopNameRef.current && enStopNameRef.current) {
            zhStopNameRef.current.style.display = "block"
            enStopNameRef.current.style.display = "none"
        }

        const progressBarToggleTimer = setInterval(() => {
            toggleDisplay(fullProgressBarRef, compactProgressBarRef)
        }, progressBarInterval)

        const stopNameToggleTimer = setInterval(() => {
            toggleDisplay(zhStopNameRef, enStopNameRef)
        }, stopNameInterval)

        return () => {
            clearInterval(progressBarToggleTimer)
            clearInterval(stopNameToggleTimer)
        }
    }, [])

    // Reset stop name display when notice toggles change
    useEffect(() => {
        if (handrailNotice || mindDoorNotice) {
            // Hide both stop names when a notice is active
            if (zhStopNameRef.current) zhStopNameRef.current.style.display = "none"
            if (enStopNameRef.current) enStopNameRef.current.style.display = "none"
        }
        else {
            // Show zh and hide en by default when no notice is active
            if (zhStopNameRef.current) zhStopNameRef.current.style.display = "block"
            if (enStopNameRef.current) enStopNameRef.current.style.display = "none"
        }
    }, [handrailNotice, mindDoorNotice])

    // Tailwind CSS classes for the layout
    const styleClasses = {
        parentGrid: `select-none grid grid-rows-[0.5fr_1.85fr_0.0375fr_1fr_0.125fr] ${monitorStyleOptions[monitorStyle]}`,
        nextStopIndicatorGrid: `@container col-start-1 col-end-2 flex flex-col text-center items-center justify-center ${stopPressed ? "bg-[#FF0000] text-white" : "bg-[#FFFF00] text-black"}`,
        nextStopIndicatorZh: "max-sm:text-[16cqw] text-[15cqw] mb-[-4px] font-[600]",
        nextStopIndicatorEn: "max-sm:text-[9cqw] text-[7.5cqw] font-[400]",
        routeHeadingGrid: "@container col-start-2 col-end-5 flex items-center pl-1 bg-black text-white",
        stopProgressBarGrid: "@container col-start-1 col-end-5 bg-white",
        stopProgressBarContainer: "relative top-[87.5%] font-[400] text-center tracking-tight",
        dividerGrid: "col-start-1 col-end-5 bg-black",
        stopNameGrid: "@container col-start-1 col-end-5 bg-white flex justify-center items-center",
        stopNameZh: "font-[500] max-sm:text-[8.5cqw] max-md:text-[10cqw] text-[8cqw] whitespace-nowrap overflow-hidden",
        stopNameEn: "text-center font-[500] max-sm:text-[4cqw] max-md:text-[5cqw] text-[5cqw]",
        driverInfoGrid: `@container flex justify-center col-start-1 col-end-5 font-extralight text-white p-1 ${stopPressed ? "bg-[#FF0000]" : "bg-black"}`,
        driverInfoText: "text-[2cqw] max-md:text-[2.25cqw]",
        capitalize: "capitalize",
        noticeZhOverrideStyle: "!text-[8cqw]",
        noticeEnOverrideStyle: "!text-[3.75cqw]",
    }

    return (
        <>
            {/* --- Screen Monitor Grid Layout --- */}
            <div
                ref={screenTarget}
                className={styleClasses.parentGrid}>

                {/* --- Next stop Indicator --- */}
                <div className={styleClasses.nextStopIndicatorGrid}>
                    <div className={styleClasses.nextStopIndicatorZh}>
                        下一站{stopPressed && `停於`}</div>
                    <div className={styleClasses.nextStopIndicatorEn}>
                        Next {stopPressed ? `Stopping at` : `Stop`}</div>
                </div>

                {/* --- Route Number & Destination --- */}
                <div className={styleClasses.routeHeadingGrid}>
                    <RouteDisplayHeading />
                </div>

                {/* --- This stop & 2 next stop & stop indicator line --- */}
                <div className={styleClasses.stopProgressBarGrid}>
                    <div className={styleClasses.stopProgressBarContainer}>
                        <StopFullProgressBar barRef={fullProgressBarRef} />
                        <StopCompactProgressBar barRef={compactProgressBarRef} />
                    </div>
                </div>

                {/* --- Horizontal divider line --- */}
                <div className={styleClasses.dividerGrid}></div>

                {/* --- Big next stop name --- */}
                <div className={styleClasses.stopNameGrid} >
                    {
                        handrailNotice ?
                            <HoldHandrailNotice
                                zhNameOverrideStyle={styleClasses.noticeZhOverrideStyle}
                                enNameOverrideStyle={styleClasses.noticeEnOverrideStyle}>
                            </HoldHandrailNotice>

                            : mindDoorNotice ?
                                <MindDoorNotice
                                    zhNameOverrideStyle={styleClasses.noticeZhOverrideStyle}
                                    enNameOverrideStyle={styleClasses.noticeEnOverrideStyle}>
                                </MindDoorNotice>
                                :
                                <>
                                    <span
                                        ref={zhStopNameRef}
                                        className={styleClasses.stopNameZh}>
                                        {stopNameZh}
                                    </span>
                                    <span
                                        ref={enStopNameRef}
                                        className={styleClasses.stopNameEn}>
                                        {stopNameEn}
                                    </span>
                                </>
                    }
                </div>

                {/* --- Driver Info --- */}
                <div className={styleClasses.driverInfoGrid}>
                    <span className={styleClasses.driverInfoText}>
                        {driverInfo?.nameZh}車長正為您服務 &nbsp; Bus Captain&nbsp;
                    </span>
                    <span className={styleClasses.driverInfoText + " " + styleClasses.capitalize}>
                        {driverInfo?.nameEn}&nbsp;
                    </span>
                    <span className={styleClasses.driverInfoText}>is serving you &nbsp;&nbsp;
                        員工編號 &nbsp;Emp. No: {driverInfo?.staffNo}</span>
                </div>

            </div >
        </>
    )
}


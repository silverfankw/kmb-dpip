import '@styles/mainDisplayPanel.css'
import { useMemo, useRef, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import { useToggleDisplay } from "@hooks"

import { LoadingSpinner } from '@components'
import {
    RouteDisplayHeading,
    FullStopProgress,
    ThreeStopProgress,
} from '@components/DPIP'
import { MainStopNameDisplay } from './MainStopNameDisplay'
import { PROGRESS_BAR_INTERVAL, getStopProgressPage } from './mainPanelConfig'

const STOP_PROGRESS_WINDOW_SIZE = 35
const WIDE_STOP_PROGRESS_WINDOW_SIZE = 52
const EMPTY_STOPS = []

export const MainDisplayPanel = ({ monitorStyle, screenTarget, isWide = false }) => {
    const { routeDetail, currentStopIndex, isLoading } = useSelector(state => ({
        routeDetail: state.routeSelection.routeDetail,
        currentStopIndex: state.routeSelection.currentStopIndex,
        isLoading: state.routeSelection.isLoading,
    }), shallowEqual)
    const { showHandrailNotice, showMindDoorNotice, stopPressed, driverInfo } = useSelector(state => ({
        showHandrailNotice: state.userPreference.showHandrailNotice,
        showMindDoorNotice: state.userPreference.showMindDoorNotice,
        stopPressed: state.userPreference.stopPressed,
        driverInfo: state.userPreference.driverInfo,
    }), shallowEqual)

    const stops = routeDetail?.stops ?? EMPTY_STOPS
    const stopCount = stops.length
    const isFirstStop = stopCount > 0 && currentStopIndex === 0
    const routeKey = `${routeDetail?.route}-${routeDetail?.bound}-${routeDetail?.service_type}`
    const [routeHeadingStage, setRouteHeadingStage] = useState(0)
    const isStageZeroWithNextStop = !isWide && !isFirstStop && routeHeadingStage === 0

    const { start: windowStart, end: windowEnd, leadingCount, trailingCount } = getStopProgressPage(
        stopCount, currentStopIndex, isWide ? WIDE_STOP_PROGRESS_WINDOW_SIZE : STOP_PROGRESS_WINDOW_SIZE
    )
    const visibleStops = useMemo(
        () => stops.slice(windowStart, windowEnd),
        [stops, windowStart, windowEnd]
    )

    const fullProgressBarRef = useRef(null)
    const compactProgressBarRef = useRef(null)
    useToggleDisplay(fullProgressBarRef, compactProgressBarRef, PROGRESS_BAR_INTERVAL, [routeKey, isLoading, stopCount])

    const panelClassName = [
        "main-display-panel",
        isWide && "main-display-panel--wide",
        isFirstStop && "main-display-panel--first-stop",
        isStageZeroWithNextStop && "main-display-panel--stage-zero",
        stopPressed && "main-display-panel--stop-pressed",
        monitorStyle,
    ].filter(Boolean).join(" ")

    return (
        <div ref={screenTarget} className={panelClassName}>
            {!isFirstStop && (
                <div className="main-display-panel__next-stop">
                    <div className="main-display-panel__next-stop-zh">
                        下一站{stopPressed && "停於"}
                    </div>
                    <div className="main-display-panel__next-stop-en">
                        Next {stopPressed ? "Stopping at" : "Stop"}
                    </div>
                </div>
            )}

            <div className="main-display-panel__heading">
                <RouteDisplayHeading onStageChange={setRouteHeadingStage} isWide={isWide} />
            </div>

            <div className="main-display-panel__progress">
                {isLoading ? <LoadingSpinner /> : stopCount > 0 && (
                    <div className="main-display-panel__progress-content">
                        <ThreeStopProgress
                            progressBarRef={compactProgressBarRef}
                            currentStop={stops[currentStopIndex]}
                            nextStop={stops[currentStopIndex + 1]}
                            followingStop={stops[currentStopIndex + 2]}
                            isLastStopVisible={currentStopIndex + 3 >= stopCount}
                        />

                        <div ref={fullProgressBarRef} className="stop-progress-display">
                            <div className="stop-progress-row" role="list" aria-label="Route stops">
                                {Array.from({ length: leadingCount }, (_, index) => (
                                    <FullStopProgress key={`previous-${index}`} continuation="previous" isWide={isWide} />
                                ))}
                                {visibleStops.map((stop, index) => (
                                    <FullStopProgress
                                        key={`${routeKey}-${windowStart + index}`}
                                        stop={stop}
                                        stopIndex={windowStart + index}
                                        currentStopIndex={currentStopIndex}
                                        stopCount={stopCount}
                                        isWide={isWide}
                                    />
                                ))}
                                {Array.from({ length: trailingCount }, (_, index) => (
                                    <FullStopProgress key={`next-${index}`} continuation="next" isWide={isWide} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!isWide && (
                <>
                    <div className="main-display-panel__divider" />
                    <MainStopNameDisplay
                        stop={stops[currentStopIndex]}
                        isFirstStop={isFirstStop}
                        routeKey={routeKey}
                        showHandrailNotice={showHandrailNotice}
                        showMindDoorNotice={showMindDoorNotice}
                    />
                </>
            )}

            <div className="main-display-panel__driver-info">
                <span>
                    {driverInfo?.nameZh}車長正為您服務 &nbsp; Bus Captain&nbsp;
                </span>
                <span className="main-display-panel__driver-name-en">
                    {driverInfo?.nameEn}&nbsp;
                </span>
                <span>
                    is serving you &nbsp;&nbsp;員工編號 &nbsp;Staff No.: {driverInfo?.staffNo}
                </span>
            </div>
        </div>
    )
}

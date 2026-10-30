import '@styles/mainPanel/mainDisplayPanel.css'
import { useEffect, useMemo, useRef, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"

import { LoadingSpinner } from '@components'
import {
    RouteDisplayHeading,
    FullStopProgress,
    CompactStopProgress,
} from '@components/DPIP'
import { MainStopNameDisplay } from './MainStopNameDisplay'
import { DISPLAY_STAGE_INTERVAL, getStopProgressPage } from './mainPanelConfig'

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
    const [displayStage, setDisplayStage] = useState(0)
    const firstStopRef = useRef(isFirstStop)
    const activeDisplayStage = isFirstStop && displayStage === 2 ? 0 : displayStage
    const displayLanguage = activeDisplayStage === 1 ? 'en' : 'zh'
    const isStageZeroWithNextStop = !isWide && !isFirstStop && routeHeadingStage === 0

    useEffect(() => {
        firstStopRef.current = isFirstStop
        if (isFirstStop) setDisplayStage(stage => stage === 2 ? 0 : stage)
    }, [isFirstStop])

    useEffect(() => {
        setDisplayStage(0)
        if (isLoading || !stopCount) return

        const timer = setInterval(() => {
            setDisplayStage(stage => (stage + 1) % (firstStopRef.current ? 2 : 3))
        }, DISPLAY_STAGE_INTERVAL)
        return () => clearInterval(timer)
    }, [routeKey, isLoading, stopCount])

    const { start: windowStart, end: windowEnd, leadingCount, trailingCount } = getStopProgressPage(
        stopCount, currentStopIndex, isWide ? WIDE_STOP_PROGRESS_WINDOW_SIZE : STOP_PROGRESS_WINDOW_SIZE
    )
    const visibleStops = useMemo(
        () => stops.slice(windowStart, windowEnd),
        [stops, windowStart, windowEnd]
    )

    const panelClassName = [
        "main-display-panel",
        isWide && "main-display-panel--wide",
        isFirstStop && "main-display-panel--first-stop",
        isStageZeroWithNextStop && "main-display-panel--stage-zero",
        stopPressed && "main-display-panel--stop-pressed",
        monitorStyle,
    ].filter(Boolean).join(" ")

    return (
        <div ref={screenTarget} className={panelClassName} data-display-stage={activeDisplayStage}>
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
                        {activeDisplayStage === 2 ? (
                            <CompactStopProgress
                                stops={stops}
                                currentStopIndex={currentStopIndex}
                                isWide={isWide}
                            />
                        ) : (
                            <div className="stop-progress-display">
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
                                            language={displayLanguage}
                                        />
                                    ))}
                                    {Array.from({ length: trailingCount }, (_, index) => (
                                        <FullStopProgress key={`next-${index}`} continuation="next" isWide={isWide} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!isWide && (
                <>
                    <div className="main-display-panel__divider" />
                    <MainStopNameDisplay
                        stop={stops[currentStopIndex]}
                        isFirstStop={isFirstStop}
                        language={displayLanguage}
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

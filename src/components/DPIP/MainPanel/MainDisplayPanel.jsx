import '@styles/mainPanel/mainDisplayPanel.css'
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"

import { LoadingSpinner } from '@components'
import { buildRouteSelectionKey } from '@store/storeConfig'
import {
    RouteDisplayHeading,
    FullStopProgress,
    CompactStopProgress,
} from '@components/DPIP'
import { MainStopNameDisplay } from './MainStopNameDisplay'
import {
    DISPLAY_STAGE_INTERVAL,
    STOP_PROGRESS_WINDOW_SIZE,
    WIDE_STOP_PROGRESS_WINDOW_SIZE,
    getStopProgressPages,
} from './mainPanelConfig'

const EMPTY_STOPS = []

export const MainDisplayPanel = memo(function MainDisplayPanel({ monitorStyle, screenTarget, isWide = false }) {
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
    const routeKey = buildRouteSelectionKey(routeDetail)
    const [routeHeadingStage, setRouteHeadingStage] = useState(0)
    const [{ stage: displayStage, pageOffset }, setDisplayCycle] = useState({ stage: 0, pageOffset: 0 })
    const progressPages = useMemo(
        () => getStopProgressPages(stopCount, isWide ? WIDE_STOP_PROGRESS_WINDOW_SIZE : STOP_PROGRESS_WINDOW_SIZE),
        [stopCount, isWide]
    )
    const currentPageIndex = progressPages.findIndex(page => currentStopIndex < page.end || page.end === stopCount)
    const remainingPageCount = progressPages.length - currentPageIndex
    const firstStopRef = useRef(isFirstStop)
    const activeDisplayStage = isFirstStop && displayStage === 2 ? 0 : displayStage
    const displayLanguage = activeDisplayStage === 1 ? 'en' : 'zh'
    const isStageZeroWithNextStop = !isWide && !isFirstStop && routeHeadingStage === 0

    useEffect(() => {
        firstStopRef.current = isFirstStop
        if (isFirstStop) setDisplayCycle(cycle => cycle.stage === 2 ? { ...cycle, stage: 0 } : cycle)
    }, [isFirstStop])

    useEffect(() => {
        setDisplayCycle({ stage: 0, pageOffset: 0 })
        if (isLoading || !stopCount) return

        const timer = setInterval(() => {
            setDisplayCycle(cycle => {
                const pageOffset = (cycle.pageOffset + 1) % remainingPageCount
                return {
                    stage: pageOffset === 0
                        ? (cycle.stage + 1) % (firstStopRef.current ? 2 : 3)
                        : cycle.stage,
                    pageOffset,
                }
            })
        }, DISPLAY_STAGE_INTERVAL / remainingPageCount)
        return () => clearInterval(timer)
    }, [routeKey, isLoading, stopCount, currentPageIndex, progressPages, remainingPageCount])

    const { start: windowStart, end: windowEnd, leadingCount, trailingCount } =
        progressPages[currentPageIndex + pageOffset % remainingPageCount]
    const visibleStops = useMemo(
        () => stops.slice(windowStart, windowEnd),
        [stops, windowStart, windowEnd]
    )
    const isDenseFullStopPage = visibleStops.length > 36
    const progressRowWidthRatio = windowStart > 0
        ? (visibleStops.length + leadingCount + trailingCount) /
            (isWide ? WIDE_STOP_PROGRESS_WINDOW_SIZE : STOP_PROGRESS_WINDOW_SIZE)
        : 1

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
                            <div className={`stop-progress-display${isDenseFullStopPage ? " stop-progress-display--dense" : ""}`}>
                                <div
                                    className="stop-progress-row"
                                    style={{ '--stop-progress-width-ratio': progressRowWidthRatio }}
                                    role="list"
                                    aria-label="Route stops"
                                >
                                    {Array.from({ length: leadingCount }, (_, index) => (
                                        <FullStopProgress
                                            key={`previous-${index}`}
                                            continuation="previous"
                                            stopIndex={windowStart - 1}
                                            currentStopIndex={currentStopIndex}
                                            isWide={isWide}
                                        />
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
                                        <FullStopProgress
                                            key={`next-${index}`}
                                            continuation="next"
                                            stopIndex={windowEnd}
                                            currentStopIndex={currentStopIndex}
                                            isWide={isWide}
                                        />
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
                    is serving you &nbsp;&nbsp;員工編號 &nbsp;Emp. No.: {driverInfo?.staffNo}
                </span>
            </div>
        </div>
    )
})

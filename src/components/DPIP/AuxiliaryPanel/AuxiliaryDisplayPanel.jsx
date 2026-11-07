import '@styles/layout/App.css'
import { memo, useMemo } from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import {
    HoldHandrailNotice,
    MindDoorNotice,
    CurrentStopNameDisplay,
    UpcomingStopNameDisplay,
    CurrentStopIndicator
} from '@components'

const styles = {
    parentGrid: [
        "select-none",
        "grid",
        "grid-cols-[10fr_90fr]",
        "grid-rows-[3.125fr_0.0125fr_1.75fr_0.0125fr_1.75fr]",
    ].join(" "),

    arrowContainer: "@container text-center bg-[#EE0000]",
    arrowIcon: "justify-center",
    currentStopContainer: "flex flex-col bg-white text-black"
}

export const AuxiliaryDisplayPanel = memo(function AuxiliaryDisplayPanel({ monitorStyle, screenTarget }) {
    const { routeDetail, currentStopIndex } = useSelector(state => ({
        routeDetail: state.routeSelection.routeDetail,
        currentStopIndex: state.routeSelection.currentStopIndex,
    }), shallowEqual)
    const { showMindDoorNotice, showHandrailNotice } = useSelector(state => ({
        showMindDoorNotice: state.userPreference.showMindDoorNotice,
        showHandrailNotice: state.userPreference.showHandrailNotice,
    }), shallowEqual)

    const stops = routeDetail?.stops

    const currentStop = useMemo(() => ({
        stopZh: stops?.[currentStopIndex]?.zh ?? '',
        stopEn: stops?.[currentStopIndex]?.en ?? '',
    }), [currentStopIndex, stops])

    const upcomingStops = useMemo(() => [1, 2].map(offset => ({
        key: offset,
        stopZh: stops?.[currentStopIndex + offset]?.zh ?? '',
        stopEn: stops?.[currentStopIndex + offset]?.en ?? '',
    })), [currentStopIndex, stops])

    const currentStopContent = (
        <>
            <div className={styles.arrowContainer}>
                <div className={styles.arrowIcon}>
                    <CurrentStopIndicator />
                </div>
            </div>
            <div className={styles.currentStopContainer}>
                <CurrentStopNameDisplay
                    stopZh={currentStop.stopZh}
                    stopEn={currentStop.stopEn}
                />
            </div>
        </>
    )

    const upcomingStopsContent = (
        <>
            {upcomingStops.map(({ key, stopZh, stopEn }) => (
                <UpcomingStopNameDisplay
                    key={key}
                    stopZh={stopZh}
                    stopEn={stopEn}
                    isSecondUpcomingStop={key === 2}
                />
            ))}
        </>
    )

    return (
        <div
            ref={screenTarget}
            className={`${styles.parentGrid} ${monitorStyle}`}
        >
            {showMindDoorNotice ? <MindDoorNotice /> : currentStopContent}
            {showHandrailNotice ? <HoldHandrailNotice /> : upcomingStopsContent}
        </div>
    )
})
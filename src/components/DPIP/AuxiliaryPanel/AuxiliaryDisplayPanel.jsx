import '@styles/App.css'
import { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
    HoldHandrailNotice,
    MindDoorNotice,
    CurrentStopNameDisplay,
    UpcomingStopNameDisplay,
    CurrentStopIndicator
} from '@components'
import { AUXILIARY_GRID_COLS, AUXILIARY_GRID_ROWS } from './auxiliaryPanelConfig'

const styles = {
    parentGrid: [
        "select-none",
        "grid",
        AUXILIARY_GRID_COLS,
        AUXILIARY_GRID_ROWS,
    ].join(" "),

    arrowContainer: "@container text-center bg-[#FF0000]",
    arrowIcon: "mt-[0.5rem] justify-center",
    currentStopContainer: "flex flex-col bg-white text-black"
}

export const AuxiliaryDisplayPanel = memo(function AuxiliaryDisplayPanel({ monitorStyle, screenTarget }) {
    const { routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
    const { showMindDoorNotice, showHandrailNotice } = useSelector(state => state.userPreference)

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
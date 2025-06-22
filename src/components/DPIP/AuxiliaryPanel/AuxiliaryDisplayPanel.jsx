import '@css/App.css'
import { useSelector } from 'react-redux'

import {
    HoldHandrailNotice,
    MindDoorNotice,
    CurrentStopNameDisplay,
    UpcomingStopNameDisplay,
    CurrentStopIndicator
} from '../'

// Tailwind Styles for the layout
const styles = {
    parentGrid: "select-none grid grid-cols-[10fr_90fr] grid-rows-[3.25fr_0.025fr_2fr_0.025fr_2fr]",
    arrowContainer: "@container text-center bg-[#FF0000]",
    arrowIcon: "mt-[0.5rem] justify-center",
    currentStopContainer: "flex flex-col bg-white",
}

export const AuxiliaryDisplayPanel = ({ monitorStyle, screenTarget }) => {

    const { routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
    const { showMindDoorNotice, showHandrailNotice } = useSelector(state => state.userPreference)

    const stops = routeDetail?.stops

    const upcomingStops = [1, 2].map(offset => (
        <UpcomingStopNameDisplay
            key={offset}
            stopZh={stops?.[currentStopIndex + offset]?.zh}
            stopEn={stops?.[currentStopIndex + offset]?.en}
        />
    ))

    return (
        <div
            ref={screenTarget}
            className={`${styles.parentGrid} ${monitorStyle}`}
        >
            {showMindDoorNotice ? (
                <MindDoorNotice />
            ) : (
                <>
                    <div className={styles.arrowContainer}>
                        <div className={styles.arrowIcon}>
                            <CurrentStopIndicator />
                        </div>
                    </div>
                    <div className={styles.currentStopContainer}>
                        <CurrentStopNameDisplay
                            stopZh={stops?.[currentStopIndex]?.zh}
                            stopEn={stops?.[currentStopIndex]?.en}
                        />
                    </div>
                </>
            )}

            {showHandrailNotice ? (
                <HoldHandrailNotice />
            ) : (
                <>
                    {upcomingStops}
                </>
            )}
        </div>
    )
}
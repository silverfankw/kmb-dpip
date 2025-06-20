import '@css/App.css'
import { useSelector } from 'react-redux'

import {
    HoldHandrailNotice,
    MindDoorNotice,
    CurrentStopNameDisplay,
    UpcomingStopNameDisplay,
    CurrentStopIndicator
} from '../'

export const AuxiliaryDisplayPanel = ({
    monitorStyleOptions,
    screenTarget
}) => {

    const { routeDetail, currentStopIndex } = useSelector(state => state.routeSelection)
    const { monitorStyle, showMindDoorNotice, showHandrailNotice } = useSelector(state => state.userPreference)

    const stops = routeDetail?.stops

    const upcomingStops = [1, 2].map(offset => (
        <UpcomingStopNameDisplay
            key={offset}
            stopZh={stops?.[currentStopIndex + offset]?.zh}
            stopEn={stops?.[currentStopIndex + offset]?.en}
        />
    ))

    // Tailwind Styles for the layout
    const styleClasses = {
        parentGrid: `select-none grid grid-cols-[10fr_90fr] grid-rows-[3.25fr_0.025fr_2fr_0.025fr_2fr] ${monitorStyleOptions[monitorStyle]}`,
        arrowContainer: "@container text-center bg-[#FF0000]",
        arrowIcon: "mt-[0.5rem] justify-center",
        currentStopContainer: "flex flex-col bg-white",
    }

    return (
        <div
            ref={screenTarget}
            className={styleClasses.parentGrid}
        >
            {showMindDoorNotice ? (
                <MindDoorNotice />
            ) : (
                <>
                    <div className={styleClasses.arrowContainer}>
                        <div className={styleClasses.arrowIcon}>
                            <CurrentStopIndicator />
                        </div>
                    </div>
                    <div className={styleClasses.currentStopContainer}>
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
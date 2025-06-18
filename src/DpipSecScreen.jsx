import './App.css'
import ArrowCircle from "../src/arrow_circle.svg?react"

import { DpipThisStop } from './DpipThisStop'
import { DpipNextStop } from './DpipNextStop'
import { HoldHandrailNotice, MindDoorNotice } from './component'

export const DPIPSecScreen = ({
    stops,
    currentStopIndex,
    userPreference: { monitorStyle, mindDoorNotice, handrailNotice },
    monitorStyleOptions,
    screenTarget
}) => {

    const showMindDoor = mindDoorNotice
    const showHandrail = handrailNotice

    const nextStops = [1, 2].map(offset => (
        <DpipNextStop
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
        thisStopContainer: "flex flex-col bg-white",
    }

    return (
        <div
            ref={screenTarget}
            className={styleClasses.parentGrid}
        >
            {showMindDoor ? (
                <MindDoorNotice />
            ) : (
                <>
                    <div className={styleClasses.arrowContainer}>
                        <div className={styleClasses.arrowIcon}>
                            <ArrowCircle />
                        </div>
                    </div>
                    <div className={styleClasses.thisStopContainer}>
                        <DpipThisStop
                            stopZh={stops?.[currentStopIndex]?.zh}
                            stopEn={stops?.[currentStopIndex]?.en}
                        />
                    </div>
                </>
            )}

            {showHandrail ? (
                <HoldHandrailNotice />
            ) : (
                <>
                    {nextStops}
                </>
            )}
        </div>
    )
}
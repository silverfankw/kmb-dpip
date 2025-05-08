import './App.css'

import { DpipThisStop } from './DpipThisStop'
import { DpipNextStop } from './DpipNextStop'
import { HoldHandrailNotice } from './component/HoldHandrailNotice'
import ArrowCircle from "../src/arrow_circle.svg?react"
import { MindDoorNotice } from './component/MindDoorNotice'

{/* DPIP secondary screen with only 3 next stops */ }
export const DPIPSecScreen = ({ stops, currentStopIndex, userPreference, containerStyle }) => {


    return (
        <>
            <div className={`grid grid-cols-[10fr_90fr] grid-rows-[3.25fr_0.025fr_2fr_0.025fr_2fr]
                ${containerStyle[userPreference.containerStyle]}`}>

                {userPreference.mindDoorNotice ?
                    <MindDoorNotice />
                    : <>
                        <div className={`@container text-center bg-[#FF0000]`}>
                            <div className="mt-[0.5rem] justify-center">
                                <ArrowCircle />
                            </div>
                        </div>
                        <div className={`flex flex-col bg-white`}>
                            <DpipThisStop
                                stopZh={stops?.[currentStopIndex]?.zh}
                                stopEn={stops?.[currentStopIndex]?.en} />
                        </div>
                    </>
                }

                {userPreference.handrailNotice ?
                    <HoldHandrailNotice />
                    :
                    <>
                        <DpipNextStop
                            stopZh={stops?.[currentStopIndex + 1]?.zh}
                            stopEn={stops?.[currentStopIndex + 1]?.en} />

                        <DpipNextStop
                            stopZh={stops?.[currentStopIndex + 2]?.zh}
                            stopEn={stops?.[currentStopIndex + 2]?.en} />
                    </>
                }
            </div >
        </>
    )
}
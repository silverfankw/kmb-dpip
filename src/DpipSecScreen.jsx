import './App.css'

import { DpipThisStop } from './DpipThisStop'
import { DpipNextStop } from './DpipNextStop'

{/* DPIP secondary screen with only 3 next stops */ }
export const DPIPSecScreen = ({ stops, currentStopIndex }) => {

    return (
        <>
            <div className='dpip-monitor-screen'>
                <div className='dpip-monitor-container'>
                    <div className="dpip-secondary-monitor-bg">

                        <DpipThisStop stopZh={stops?.[currentStopIndex]?.zh} stopEn={stops?.[currentStopIndex]?.en} />

                        {stops?.slice(currentStopIndex + 1, currentStopIndex + 3)?.map((stop, index) => {
                            return (
                                <DpipNextStop rowIndex={index} stopZh={stop?.zh} stopEn={stop?.en} currentStopIndex={currentStopIndex} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
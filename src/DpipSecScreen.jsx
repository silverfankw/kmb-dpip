import './App.css'

import { DpipThisStop } from './DpipThisStop'
import { DpipNextStop } from './DpipNextStop'
import { Arrow } from './component/Arrow'

{/* DPIP secondary screen with only 3 next stops */ }
export const DPIPSecScreen = ({ stops, currentStopIndex, userPreference }) => {

    const containerStyle = {
        basic: "border-[.5em] border-solid border-[#0e0e0fbf] rounded-xl outline outline-[1rem] outline-black",
        new: "border-solid border-black "
    }

    return (
        <>
            <div className={`grid grid-cols-[10fr_90fr] grid-rows-[3fr_0.025fr_2fr_0.025fr_2fr]
            w-[50%] max-w-[50rem] h-[30rem] 
                ${containerStyle[userPreference.containerStyle]}`}>

                <div className={`text-center bg-[#FF0000]`}>
                    <Arrow direction="down" size="xl" stroke="l" />
                    <Arrow direction="down" size="xl" stroke="l" style={`mt-[-2rem]`} />
                    <Arrow direction="down" size="xl" stroke="l" style={`mt-[-2rem]`} />
                    <div className='mt-[1rem] inline-block rounded-[50%] bg-white w-[50px] h-[50px]'>
                        <div className='mt-[.375rem] inline-block rounded-[50%] 
                        border-solid border-red-600 border-[2px] bg-yellow-300 w-[37.5px] h-[37.5px]'>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col bg-white`}>
                    <DpipThisStop
                        stopZh={stops?.[currentStopIndex]?.zh}
                        stopEn={stops?.[currentStopIndex]?.en} />
                </div>

                <DpipNextStop
                    stopZh={stops?.[currentStopIndex + 1]?.zh}
                    stopEn={stops?.[currentStopIndex + 1]?.en} />

                <DpipNextStop
                    stopZh={stops?.[currentStopIndex + 2]?.zh}
                    stopEn={stops?.[currentStopIndex + 2]?.en} />

            </div >
        </>
    )
}
import { useContext } from "react"
import { routeContext } from "./context/Provider"

export const DpipFullStopScreen = () => {

    const { routeDetail, currentStopIndex } = useContext(routeContext)

    return (
        <div className="pl-4 w-fit h-full
        flex items-center overflow-hidden">
            {routeDetail.stops?.map((stop, i) => {
                if (currentStopIndex <= i)
                    return (
                        <div key={`stop-list-${i}`}
                            className='
                            w-[6rem] -rotate-[60deg] translate-y-4 origin-top-left 
                    text-[0.5rem] break-all md:text-xs text-black'>
                            {stop.zh}
                        </div>
                    )
            })}
        </div >
    )
}
import { useContext } from "react"
import TripleArrow from "../src/triple_arrow.svg?react"
import { routeContext } from './context/Provider';

export const RouteDisplayHeading = () => {

    const selectedRoute = useContext(routeContext)

    const adjustRouteWidth = () => {
        // const route = selectedRoute?.routeDetail?.route
        // switch (route?.length) {
        //     case 3:
        //         return { fontSize: "6.5cqw" }
        //     case 4:
        //         return { fontSize: "6.5cqw" }
        //     default:
        //         break
        // }
    }


    return (
        <>
            {/* Route Marker (Zh + En) */}
            <div className='text-center flex flex-col item-center 
                        basis-[4rem] max-md:basis-[3rem]'>
                <div className="font-[500] max-sm:text-[4cqw] 
                            text-[4cqw] tracking-tighter">路線</div>
                <div className="max-sm:text-[3cqw] text-[2.75cqw] tracking-tighter">Route</div>
            </div>

            {/* Exact Route */}
            <div className="font-[500] text-[7cqw] 
                        text-center tracking-tight 
                        basis-[7rem] max-md:basis-[5rem]"
                style={adjustRouteWidth()}>
                {selectedRoute.routeDetail.route}</div>
            <div className='flex justify-center basis-[4.5rem] 
                        max-sm:basis-[2.5rem] max-xl:basis-[3.5rem]'>
                <TripleArrow />
            </div>

            {/* Destination Name (Zh + En) */}
            <div className='flex flex-col pl-[0.5rem]'>
                <div className='max-sm:text-[5cqw] max-md:text-[4.5cqw] text-[4.5cqw] font-[500] whitespace-nowrap'>
                    {selectedRoute.routeDetail?.stops?.[selectedRoute?.lastStopIndex].zh}
                </div>
                <div className="max-sm:text-[2.5cqw] max-md-[2.25cqw] text-[2.25cqw] font-[500] text-sm whitespace-nowrap">
                    {selectedRoute.routeDetail?.stops?.[selectedRoute?.lastStopIndex].en}
                </div>
            </div>
        </>
    )
}
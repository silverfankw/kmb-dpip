import { useSelector } from "react-redux"
import { TripleArrow } from "@components"

// Tailwind CSS classes for the component
const styleClasses = {
    routeMarkerContainer: "text-center flex flex-col items-center basis-[10%]",
    routeMarkerZh: "font-[500] max-sm:text-[4cqw] text-[4cqw] tracking-tighter ",
    routeMarkerEn: "max-sm:text-[3cqw] text-[2.75cqw] tracking-tighter ",
    routeNumber: "font-[500] text-[6.5cqw] text-center tracking-tight basis-[17.5%]",
    arrowContainer: "flex justify-center basis-[10%] max-sm:basis-[2.5rem] max-xl:basis-[3.5rem]",
    destContainer: "flex flex-col pl-[0.5rem]",
    destZh: "max-sm:text-[5cqw] max-md:text-[4.5cqw] text-[4.5cqw] font-[500] whitespace-nowrap",
    destEn: "max-sm:text-[2.5cqw] max-md-[2.25cqw] text-[2.25cqw] font-[500] text-sm whitespace-nowrap",
}

export const RouteDisplayHeading = () => {

    const { routeDetail, lastStopIndex } = useSelector(state => state.routeSelection)

    return (
        <>
            {/* Route Marker (Zh + En) */}
            <div className={styleClasses.routeMarkerContainer}>
                <div className={styleClasses.routeMarkerZh}>路線</div>
                <div className={styleClasses.routeMarkerEn}>Route</div>
            </div>

            {/* Exact Route */}
            <div className={styleClasses.routeNumber}>
                {routeDetail.route}
            </div>

            <div className={styleClasses.arrowContainer}>
                <TripleArrow />
            </div>

            {/* Destination Name (Zh + En) */}
            <div className={styleClasses.destContainer}>
                <div className={styleClasses.destZh}>
                    {routeDetail?.stops?.[lastStopIndex]?.zh}
                </div>
                <div className={styleClasses.destEn}>
                    {routeDetail?.stops?.[lastStopIndex]?.en}
                </div>
            </div>
        </>
    )
}
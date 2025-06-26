import { useSelector } from "react-redux"
import { TripleArrow } from "@components"

// Tailwind CSS classes for the component
const styles = {
    routeMarkerContainer: [
        "flex flex-col",
        "basis-[10%]",
        "text-center",
        "items-center"
    ].join(" "),

    routeMarkerZh: [
        "font-[500]",
        "tracking-tighter",
        "text-[4cqw]",
        "max-sm:text-[4cqw]"
    ].join(" "),

    routeMarkerEn: [
        "tracking-tighter",
        "text-[2.75cqw]",
        "max-sm:text-[3cqw]"
    ].join(" "),


    routeNumber: [
        "basis-[17.5%]",
        "font-[500]",
        "text-[6.75cqw]",
        "text-center",
        "tracking-tight",
        "scale-y-110",
    ].join(" "),


    arrowContainer: [
        "flex",
        "basis-[10%]",
        "max-xl:basis-[3.25rem]",
        "max-sm:basis-[2rem]",
        "justify-center"
    ].join(" "),


    destContainer: [
        "flex flex-col",
        "mr-0.5",
    ].join(" "),

    destZh: [
        "font-[500]",
        "whitespace-nowrap",
        "text-[4.375cqw]",
        "max-md:text-[4.375cqw]",
        "max-sm:text-[5cqw]"
    ].join(" "),

    destEn: [
        "font-[500]",
        "text-sm",
        "whitespace-nowrap",
        "text-[2.25cqw]",
        "max-md-[2.25cqw]",
        "max-sm:text-[2.5cqw]"
    ].join(" ")
}

export const RouteDisplayHeading = () => {

    const { routeDetail, lastStopIndex } = useSelector(state => state.routeSelection)

    return (
        <>
            {/* Route Marker (Zh + En) */}
            <div className={styles.routeMarkerContainer}>
                <div className={styles.routeMarkerZh}>路線</div>
                <div className={styles.routeMarkerEn}>Route</div>
            </div>

            {/* Exact Route */}
            <div className={styles.routeNumber}>
                {routeDetail.route}
            </div>

            <div className={styles.arrowContainer}>
                <TripleArrow />
            </div>

            {/* Destination Name (Zh + En) */}
            <div className={styles.destContainer}>
                <div className={styles.destZh}>
                    {routeDetail?.stops?.[lastStopIndex]?.zh}
                </div>
                <div className={styles.destEn}>
                    {routeDetail?.stops?.[lastStopIndex]?.en}
                </div>
            </div>
        </>
    )
}
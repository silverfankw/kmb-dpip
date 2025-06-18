import { useState, useCallback } from "react"
import { fetchStopIDs, fetchAllStops } from '../api/kmb'
import { isEmptyObject } from '../../utility/Util'

export const useRouteSelection = routeList => {

    const [routeDetail, setRouteDetail] = useState({})
    const [currentStopIndex, setCurrentStopIndex] = useState(0)
    const [routeHasTwoBound, setRouteHasTwoBound] = useState(false)

    // Check if the route has both inbound and outbound
    const checkRoundTripBound = useCallback((inputRoute) => {
        const hasTwoBound =
            routeList.some(route => route.bound === "I" && route.route === inputRoute) &&
            routeList.some(route => route.bound === "O" && route.route === inputRoute)
        setRouteHasTwoBound(hasTwoBound)
    }, [routeList])

    // Select a route and fetch its stops
    const selectRoute = useCallback(async ({ value }) => {
        try {
            setCurrentStopIndex(0)
            const routeInfo = JSON.parse(value)
            const { route, bound, service_type, orig_tc, orig_en, dest_tc, dest_en } = routeInfo
            checkRoundTripBound(route)

            const normalizedBound = bound === "I" || bound === "inbound" ? "inbound" : "outbound"
            const stopIDs = await fetchStopIDs(route, normalizedBound, service_type)
            const routeAllStops = await fetchAllStops(stopIDs)

            setRouteDetail(prev => ({
                ...prev,
                route,
                bound,
                stops: routeAllStops,
                orig_tc,
                orig_en,
                dest_en,
                dest_tc,
                service_type,
            }))
        } catch (err) {
            console.error("Failed to fetch route details:", err)
        }
    }, [checkRoundTripBound])

    // Change route bound
    const changeBound = useCallback(() => {
        if (!isEmptyObject(routeDetail) && (routeHasTwoBound || routeDetail?.service_type === 1)) {
            const { bound } = routeDetail
            selectRoute({
                value: JSON.stringify({
                    ...routeDetail,
                    bound: bound === "inbound" ? "outbound" : "inbound",
                })
            })
        }
    }, [routeDetail, routeHasTwoBound, selectRoute])

    return {
        routeDetail,
        setRouteDetail,
        currentStopIndex,
        setCurrentStopIndex,
        routeHasTwoBound,
        checkRoundTripBound,
        selectRoute,
        changeBound,
    }
}
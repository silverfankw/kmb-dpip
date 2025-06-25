export const itemSeparator = '｜'
export const toSeparator = "往"
export const specialTripKey = "特別班"

export const formatRouteLabel = (route) => ({
    routeNumber: route.route,
    origin: route.orig_tc,
    destination: route.dest_tc,
    isSpecial: route.service_type !== '1',
    remark: route.specialRemark
})

export const createRouteOption = (route) => {
    const { routeNumber, origin, destination, isSpecial, remark } = formatRouteLabel(route)
    return {
        label: [
            routeNumber,
            `${origin} ${toSeparator} ${destination}`,
            isSpecial ? specialTripKey : '',
            remark || ''
        ].join(itemSeparator),
        value: `${route.route}-${route.bound}-${route.service_type}`,
        detail: route
    }
}
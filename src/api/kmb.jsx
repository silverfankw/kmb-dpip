import { transformStopDetail, removeLeadingZero, convertBound, additionalRoutes, additionalRouteStops, compareRouteNumbers } from '@utils'

const SPECIAL_ROUTE_REMARK_RESPONSE_KEY = "Desc_CHI"

// Cache to store stop details to avoid redundant API calls
const stopCache = new Map()

export async function fetchAllRoutes() {
    const res = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/')
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    return [...json.data, ...additionalRoutes].sort(compareRouteNumbers)
}

export async function fetchStopIDs(route, bound, service_type) {
    const normalizedBound = bound === "I" || bound === "inbound" ? "inbound" : "outbound"

    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${normalizedBound}/${service_type}`)
    const json = await res.json()
    const data = json.data

    if (data.length == 0) {
        return additionalRouteStops.filter(stop => stop.route === route && stop.bound === bound && stop.service_type === service_type).map(stop => stop.stop)
    }
    return data.map(stop => stop.stop)
}

export async function fetchStopDetail(stopID) {

    if (stopCache.has(stopID)) {
        return stopCache.get(stopID)
    }

    try {
        const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`)
        if (!res.ok)
            throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)

        const json = await res.json()
        const transformedData = transformStopDetail(json)
        stopCache.set(stopID, transformedData)

        return transformedData

    }
    catch (error) {
        console.error(`Error when fetching stop detail for stopID: ${stopID}`, error)
        throw error
    }
}

export async function fetchAllStops(stopIDs) {
    return Promise.all(stopIDs.map(fetchStopDetail))
}

export async function fetchSpecialRouteRemark(route, bound, service_type) {
    const convertedBound = convertBound(bound, 'number')

    const res = await fetch(`https://search.kmb.hk/KMBWebSite/Function/FunctionRequest.ashx?action=getSpecialRoute&route=${route}&bound=${convertedBound}`, {
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    })

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()

    const remark = json.data?.routes?.find(
        ({ Route, Bound, ServiceType }) =>
            route === Route &&
            convertedBound === Bound &&
            service_type === removeLeadingZero(ServiceType?.trim())
    )

    return remark?.[SPECIAL_ROUTE_REMARK_RESPONSE_KEY] ?? ""
}
import { transformStopDetail } from '@utils/responseTransformers'

// Cache to store stop details to avoid redundant API calls
const stopCache = new Map()

export async function fetchStopIDs(route, bound, service_type) {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${bound}/${service_type}`)
    const json = await res.json()
    return json.data.map(stop => stop.stop)
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
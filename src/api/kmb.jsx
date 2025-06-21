export async function fetchStopIDs(route, bound, service_type) {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${bound}/${service_type}`)
    const json = await res.json()
    return json.data.map(stop => stop.stop)
}

export async function fetchStopDetail(stopID) {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopID}`)
    const json = await res.json()
    return { en: json.data.name_en, zh: json.data.name_tc }
}

export async function fetchAllStops(stopIDs) {
    return Promise.all(stopIDs.map(fetchStopDetail))
}
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const isText = value => typeof value === 'string'

export const validatePayload = payload => {
    if (!isRecord(payload) || !['route', 'directionLabelZh', 'directionLabelEn'].every(key => isText(payload[key])) ||
        !isRecord(payload.captain) || !['surnameZh', 'nameEn', 'staffNo'].every(key => isText(payload.captain[key])) ||
        !Number.isInteger(payload.currentSeq) || !Array.isArray(payload.stops)) {
        throw new Error('Invalid display payload: expected route, destination, captain, currentSeq and stops.')
    }
    if (payload.now !== undefined && (!isText(payload.now) || !Number.isFinite(Date.parse(payload.now)))) {
        throw new Error('Invalid display payload: now must be a valid timestamp.')
    }
    const sequences = new Set()
    payload.stops.forEach(stop => {
        if (!isRecord(stop) || !Number.isInteger(stop.seq) || !isText(stop.stopId) || !isText(stop.nameZh) ||
            (stop.nameEn !== undefined && !isText(stop.nameEn)) ||
            (stop.landmarksZh !== undefined && !isText(stop.landmarksZh) &&
                !(Array.isArray(stop.landmarksZh) && stop.landmarksZh.every(isText))) ||
            (stop.etaMin != null && (!Number.isFinite(stop.etaMin) || stop.etaMin < 0)) ||
            sequences.has(stop.seq)) {
            throw new Error('Invalid display payload: each stop needs a unique sequence, ID, names and valid optional ETA/landmarks.')
        }
        sequences.add(stop.seq)
    })
    return payload
}

import { readRouteDataCache, writeRouteDataCache } from './routeDataCache.js'

export const ROUTE_DATA_MAX_AGE = 6 * 60 * 60 * 1000
const REQUEST_TIMEOUT = 8000
const MAX_ATTEMPTS = 3

const parseData = text => JSON.parse(text.replace(/:\s*NaN\b/g, ': null'))

const requestDataset = async (url, normalize, { fetchData, wait, random }) => {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
        let retryable = true
        try {
            const response = await fetchData(url, { signal: controller.signal })
            if (!response.ok) {
                retryable = response.status === 408 || response.status === 429 || response.status >= 500
                throw new Error(`Route data request failed: HTTP ${response.status} (${url}).`)
            }
            const text = await response.text()
            retryable = false
            const data = parseData(text)
            const normalized = normalize(data)
            return { data, normalized }
        } catch (error) {
            if (!retryable || attempt === MAX_ATTEMPTS - 1) throw error
            console.warn('Retrying route data request:', error)
        } finally {
            clearTimeout(timeout)
        }
        await wait(500 * 2 ** attempt + Math.floor(random() * 500))
    }
}

export const loadRouteDataset = async ({
    sources, snapshotUrl, normalize, publish, force = false,
    fetchData = (...args) => fetch(...args),
    readCache = readRouteDataCache, writeCache = writeRouteDataCache,
    now = Date.now, wait = delay => new Promise(resolve => setTimeout(resolve, delay)),
    random = Math.random,
}) => {
    let current
    let cacheWarning = null
    const warnings = []
    const dependencies = { fetchData, wait, random }
    const publishCurrent = (refreshing, refreshError = null) => publish(current.normalized, {
        source: current.source,
        savedAt: current.savedAt,
        refreshing,
        refreshError,
        cacheWarning,
    })
    try {
        const cached = await readCache()
        if (cached !== undefined) {
            if (!cached || !Number.isFinite(cached.savedAt) || cached.savedAt <= 0 || cached.savedAt > now() ||
                typeof cached.source !== 'string') {
                throw new Error('Invalid route data cache metadata.')
            }
            current = { ...cached, normalized: normalize(cached.data), source: 'cache' }
        }
    } catch (error) {
        console.warn('Unable to read cached route data:', error)
        cacheWarning = error.message
    }

    const fresh = current && now() - current.savedAt < ROUTE_DATA_MAX_AGE
    if (current) {
        publishCurrent(force || !fresh)
        if (fresh && !force) return current.normalized
    } else {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
        try {
            const response = await fetchData(snapshotUrl, { signal: controller.signal })
            if (!response.ok) throw new Error(`Bundled route snapshot unavailable: HTTP ${response.status}.`)
            const snapshot = parseData(await response.text())
            if (!Number.isFinite(Date.parse(snapshot.generatedAt))) {
                throw new Error('Invalid bundled route snapshot date.')
            }
            current = {
                data: snapshot.data, normalized: normalize(snapshot.data),
                source: 'snapshot', savedAt: Date.parse(snapshot.generatedAt),
            }
            publishCurrent(true)
        } catch (error) {
            console.warn('Unable to load bundled route snapshot:', error)
            warnings.push(error.message)
        } finally {
            clearTimeout(timeout)
        }
    }

    for (const source of sources) {
        try {
            const { data, normalized } = await requestDataset(source, normalize, dependencies)
            current = { data, normalized, source, savedAt: now() }
            try {
                await writeCache({ data, source, savedAt: current.savedAt })
            } catch (error) {
                console.warn('Unable to cache downloaded route data:', error)
                cacheWarning = error.message
            }
            publishCurrent(false)
            return normalized
        } catch (error) {
            console.warn('Route data source unavailable:', error)
            warnings.push(error.message)
        }
    }
    const error = new Error(`Unable to refresh route data. ${warnings.join(' ')}`)
    if (current) {
        publishCurrent(false, error.message)
        return current.normalized
    }
    throw error
}

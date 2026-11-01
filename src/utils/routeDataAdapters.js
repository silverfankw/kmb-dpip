import { buildRouteKey, normalizeValue, routeStoreConfig } from '../store/storeConfig.js'

const operatorFields = {
    kmb: { originZh: 'orig_tc', destinationZh: 'dest_tc', hasServiceType: true },
    ctb: { originZh: 'orig_zh', destinationZh: 'dest_zh', hasServiceType: false },
}

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)

const requireText = (value, field) => {
    if (
        (typeof value !== 'string' && typeof value !== 'number') ||
        (typeof value === 'number' && !Number.isFinite(value)) ||
        !String(value).trim()
    ) {
        throw new Error(`Invalid route data: ${field} must contain text.`)
    }

    return normalizeValue(value)
}

export const normalizeRouteData = (data, operator = routeStoreConfig.defaultOperator) => {
    if (!Object.hasOwn(operatorFields, operator)) {
        throw new Error(`Unsupported route operator: ${operator}`)
    }

    if (!isRecord(data) || !isRecord(data.routes) || !isRecord(data.stops)) {
        throw new Error('Invalid route data: expected operator-grouped routes and stops.')
    }

    const sourceRoutes = data.routes[operator]
    const stopLookup = data.stops[operator]

    if (!Array.isArray(sourceRoutes) || sourceRoutes.length === 0 || !isRecord(stopLookup)) {
        throw new Error(`Invalid route data: routes.${operator} must be a non-empty array and stops.${operator} must be an object.`)
    }

    const fields = operatorFields[operator]
    const seenKeys = new Set()
    const normalizedRoutes = []

    sourceRoutes.forEach((source, index) => {
        const context = `routes.${operator}[${index}]`
        if (!isRecord(source)) {
            throw new Error(`Invalid route data: ${context} must be an object.`)
        }

        const route = {
            operator,
            route: requireText(source.route, `${context}.route`),
            bound: requireText(source.bound, `${context}.bound`),
            service_type: fields.hasServiceType
                ? requireText(source.service_type, `${context}.service_type`) : '',
            orig_tc: requireText(source[fields.originZh], `${context}.${fields.originZh}`),
            orig_en: requireText(
                source.orig_en === undefined && operator === 'kmb' ? source.ORIG_EN : source.orig_en,
                `${context}.orig_en`
            ),
            dest_tc: requireText(source[fields.destinationZh], `${context}.${fields.destinationZh}`),
            dest_en: requireText(source.dest_en, `${context}.dest_en`),
            specialRemark: normalizeValue(source.special_remark_tc ?? source.special_remark_en ?? source.specialRemark ?? ''),
        }

        const stopIds = source.stops
        if (!routeStoreConfig.boundValues.includes(route.bound) || !Array.isArray(stopIds)) {
            throw new Error(`Invalid route data: ${context} must have an I/O bound and a stops array.`)
        }
        if (fields.hasServiceType && stopIds.length === 0) {
            throw new Error(`Invalid route data: ${context} has no stops.`)
        }

        route.stops = stopIds.map(stopId => {
            if (typeof stopId !== 'string' || !stopId.trim()) {
                throw new Error(`Invalid route data: ${context} stop IDs must be non-empty strings.`)
            }
            const stop = Object.hasOwn(stopLookup, stopId) ? stopLookup[stopId] : null
            if (!isRecord(stop)) {
                throw new Error(`Invalid route data: ${context} references missing stop ${operator}/${stopId}.`)
            }

            return {
                id: stopId,
                zh: requireText(stop.stop_name_zh ?? stop.name_tc, `stops.${operator}.${stopId}.stop_name_zh`),
                en: requireText(stop.stop_name_en ?? stop.name_en, `stops.${operator}.${stopId}.stop_name_en`),
            }
        })

        const key = buildRouteKey(route)
        if (!seenKeys.has(key)) {
            seenKeys.add(key)
            normalizedRoutes.push(route)
        }
    })

    return normalizedRoutes
}

import { routeUtilityConfig } from './routeUtilityConfig'

const extractNameWithoutId = (fullName) => {
    return fullName
        ?.replace(routeUtilityConfig.stopIdPattern, '')
        ?.replace(routeUtilityConfig.stopNameCleanupPattern, ' ')
        ?.trim()
}

export const transformStopDetail = (apiResponse) => {
    const nameEn = apiResponse.data.name_en
    const nameZh = apiResponse.data.name_tc

    return {
        en: extractNameWithoutId(nameEn),
        zh: extractNameWithoutId(nameZh),
    }
}

export const convertBound = (bound, toFormat = 'number') => {
    if (!bound) return bound

    return routeUtilityConfig.boundConversions[toFormat]?.[bound] || bound
}

export const removeLeadingZero = str => str ? String(Number.parseInt(str, 10)) : str

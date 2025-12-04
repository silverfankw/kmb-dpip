// Utility functions to transform API responses into a more usable format.

// Regular expression to match stop ID pattern: (XX999) at the end of string
const STOP_ID_REGEX = /\([A-Z]{2}\d{3}[A-Za-z]?\)$/

// Helper to extract stop name without ID
const extractNameWithoutId = (fullName) => {
    return fullName.replace(STOP_ID_REGEX, '').trim()
}

// Helper to extract just the stop ID
const extractStopId = (fullName) => {
    const match = fullName.match(STOP_ID_REGEX)
    return match ? match[0].replace(/[()]/g, '') : null
}

export const transformStopDetail = (apiResponse) => {
    const nameEn = apiResponse.data.name_en
    const nameZh = apiResponse.data.name_tc

    return {
        en: extractNameWithoutId(nameEn),
        zh: extractNameWithoutId(nameZh),
        // stopId: extractStopId(nameEn)
    }
}

// Converts between KMB bound formats (I/O <-> 1/2)
export const convertBound = (bound, toFormat = 'number') => {
    if (!bound) return bound

    const conversions = {
        'number': { 'O': '1', 'I': '2' },
        'letter': { '1': 'O', '2': 'I' }
    }

    return conversions[toFormat]?.[bound] || bound
}

export const removeLeadingZero = str => str ? String(parseInt(str, 10)) : str

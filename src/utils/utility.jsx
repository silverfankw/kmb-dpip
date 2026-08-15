import { routeUtilityConfig } from './routeUtilityConfig'

const isEmptyObject = obj => Object.keys(obj).length === 0

const debounce = (func, delay = routeUtilityConfig.debounceDelayMs) => {
    let timer = null

    return function (...args) {
        const context = this

        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}

const getRandomIntInclusive = (min, max) => {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

export { isEmptyObject, debounce, getRandomIntInclusive }
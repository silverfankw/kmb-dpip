const isEmptyObject = obj => Object.keys(obj).length == 0

const debounce = (func, delay = 250) => {
    let timer = null

    return function (...args) {
        let context = this

        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}

const getRandomIntInclusive = (min, max) => {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}

export { isEmptyObject, debounce, getRandomIntInclusive }
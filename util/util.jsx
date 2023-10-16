const isEmptyObject = obj => Object.keys(obj).length == 0

const debounce = (func, delay = 250) => {
    let timer = null;

    return function (...args) {
        let context = this;

        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    }
}
export { isEmptyObject, debounce }
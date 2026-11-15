const DATABASE = 'dpip-route-data'
const STORE = 'datasets'
const KEY = 'last-good'
const TIMEOUT = 5000

const transact = (mode, operation) => new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
        reject(new Error('IndexedDB is unavailable.'))
        return
    }
    let database
    let transaction
    let settled = false
    const finish = (error, result) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        database?.close()
        if (error) reject(error)
        else resolve(result)
    }
    const timer = setTimeout(() => {
        finish(new Error('Route data cache timed out.'))
        transaction?.abort()
    }, TIMEOUT)
    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onerror = () => finish(request.error)
    request.onblocked = () => finish(new Error('Route data cache is blocked by another tab.'))
    request.onsuccess = () => {
        database = request.result
        if (settled) {
            database.close()
            return
        }
        try {
            transaction = database.transaction(STORE, mode)
            const result = operation(transaction.objectStore(STORE))
            transaction.oncomplete = () => finish(null, result.result)
            transaction.onabort = () => finish(transaction.error ?? new Error('Route data cache transaction aborted.'))
            transaction.onerror = () => finish(transaction.error)
        } catch (error) {
            finish(error)
        }
    }
})

export const readRouteDataCache = () => transact('readonly', store => store.get(KEY))
export const writeRouteDataCache = data => transact('readwrite', store => store.put(data, KEY))

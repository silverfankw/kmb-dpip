import { useState, useEffect, useRef, useCallback } from 'react'

const USER_SELECTION_KEY = 'userSelection'
const SAVE_DELAY = 200

export const useLocalStorageState = () => {
    const [hasStoredData, setHasStoredData] = useState(false)
    const [storedData, setStoredData] = useState(null)
    const pendingDataRef = useRef(null)
    const timeoutRef = useRef(null)

    const saveToLocalStorageNow = useCallback((data) => {
        try {
            localStorage.setItem(USER_SELECTION_KEY, JSON.stringify(data))
            setStoredData(data)
            setHasStoredData(true)
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem(USER_SELECTION_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setStoredData(parsed)
                setHasStoredData(true)
            } catch (error) {
                console.error('Error parsing stored data:', error)
                localStorage.removeItem(USER_SELECTION_KEY)
            }
        }
    }, [])

    const saveToLocalStorage = useCallback((data) => {
        pendingDataRef.current = data

        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = null

            if (pendingDataRef.current) {
                saveToLocalStorageNow(pendingDataRef.current)
            }
        }, SAVE_DELAY)
    }, [saveToLocalStorageNow])

    useEffect(() => () => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const clearStoredData = () => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        pendingDataRef.current = null
        localStorage.removeItem(USER_SELECTION_KEY)
        setHasStoredData(false)
        setStoredData(null)
    }

    return {
        hasStoredData,
        storedData,
        saveToLocalStorage,
        saveToLocalStorageNow,
        clearStoredData
    }
}
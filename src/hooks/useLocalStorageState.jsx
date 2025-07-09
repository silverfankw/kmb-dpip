import { useState, useEffect } from 'react'

export const useLocalStorageState = () => {
    const [hasStoredData, setHasStoredData] = useState(false)
    const [storedData, setStoredData] = useState(null)

    useEffect(() => {
        const stored = localStorage.getItem('userSelection')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setStoredData(parsed)
                setHasStoredData(true)
            } catch (error) {
                console.error('Error parsing stored data:', error)
                localStorage.removeItem('userSelection')
            }
        }
    }, [])

    const saveToLocalStorage = (data) => {
        try {
            localStorage.setItem('userSelection', JSON.stringify(data))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    }

    const clearStoredData = () => {
        localStorage.removeItem('userSelection')
        setHasStoredData(false)
        setStoredData(null)
    }

    return {
        hasStoredData,
        storedData,
        saveToLocalStorage,
        clearStoredData
    }
}
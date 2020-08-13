import { useState, useEffect } from 'react'

const getSavedValue = (key, initial) => {
    const savedValue = localStorage.getItem(key)
    if(savedValue) return JSON.parse(savedValue)

    if(initial instanceof Function) return initial()

    return initial
}

export const useLocalStorage = (key, initial) => {
    const [value, setValue] = useState(() => {
        return getSavedValue(key, initial)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}
import { useState, useEffect } from 'react'

const getSavedValue = (key, initial) => {
    const savedValue = localStorage.getItem(key)
    if(savedValue) return savedValue

    if(initial instanceof Function) return initial()

    return initial
}

export const useLocalStorage = (key, initial) => {
    const [value, setValue] = useState(() => {
        return getSavedValue(key, initial)
    })

    useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key])

    return [value, setValue]
}
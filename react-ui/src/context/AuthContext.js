import React, { createContext, useState, useEffect } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'

export const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(undefined)
    const [token, setToken] = useLocalStorage('token', '')
    const [isAuthenticated, setAuth] = useState(false)

    const initUser = async () => {
        // Get user if exist
    }

    useEffect(() => {
        initUser()
    }, []) 
    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            setUser,
            setAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}
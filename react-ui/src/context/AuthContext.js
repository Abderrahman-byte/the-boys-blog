import React, { createContext, useState, useEffect } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage'

export const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(undefined)
    const [token, setToken] = useLocalStorage('token', '')
    const [isAuthenticated, setAuth] = useState(false)

    const initUser = async () => {
        const req = await fetch('http://127.0.0.1:8000/api/user/', {
            method: 'GET',
            headers: {
                'authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            console.log(data)
            if(data.user) {
                setAuth(true)
                setUser(data.user)
            } else {
                setAuth(false)
                setUser(null)
            }
        } else {
            setAuth(false)
            setUser(null)
        }
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
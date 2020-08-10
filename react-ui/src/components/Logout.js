import React, { useContext, useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'

export const Logout = () => {
    const { logout } = useContext(AuthContext)
    const location = useLocation()
    const from = location.state ? location.state.from : null

    useEffect(() => {
        logout()
    })

    return <Redirect to={from && ''} />
} 

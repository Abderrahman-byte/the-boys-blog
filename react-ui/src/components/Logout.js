import React, { useContext, useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'

export const Logout = () => {
    const { logout } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const location = useLocation()
    const from = location.state ? location.state.from : null

    useEffect(() => {
        openModel(<LoadingModel text="Login Out..." />, false)
        logout()
        setTimeout(closeModel, 1000)
    })

    return <Redirect to={from || ''} />
} 

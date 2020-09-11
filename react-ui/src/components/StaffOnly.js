import React, { useContext, useEffect } from 'react'
import { Route } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'
import { NotFound } from '../pages/NotFound'

export const StaffOnlyRouter = ({component, ...rest}) => {
    const { user } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    const toRender = user === undefined ? (() => <div></div>) : user && (user.is_staff || user.is_superuser) ? component : NotFound

    useEffect(() => {
        if(user === undefined) {
            openModel(<LoadingModel />, false)
        } else {
            setTimeout(closeModel, 1000)
        }
    }, [user])

    return (
        <Route {...rest} component={toRender} />
    )
}
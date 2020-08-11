import React, { useContext } from 'react'
import { Route } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'

export const StaffOnlyRouter = ({children, ...rest}) => {
    const { user } = useContext(AuthContext)
    const component = user && (user.is_staff || user.is_superuser) ? children : (<div><h1>This page Dont exists</h1></div>)

    return (
        <Route {...rest} render={() => component} />
    )
}
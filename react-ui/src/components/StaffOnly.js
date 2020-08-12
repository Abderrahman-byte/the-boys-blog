import React, { useContext } from 'react'
import { Route } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'

const NotFound = () => {
    return (<div><h1>This page Dont exists</h1></div>)
}
export const StaffOnlyRouter = ({component, ...rest}) => {
    const { user } = useContext(AuthContext)
    const toRender = user && (user.is_staff || user.is_superuser) ? component : NotFound

    return (
        <Route {...rest} component={toRender} />
    )
}
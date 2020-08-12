import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ProfilPage } from './Profil.page'
import { AuthContext } from '../context/AuthContext'

export const StaffPages = ({match}) => {
    const { user } = useContext(AuthContext)
    
    return (
        <Switch>
            <Route path={`${match.path}/profil`}>
                <ProfilPage profil={user} />
            </Route>
            <Redirect exact from={`${match.path}`} to={`${match.path}/profil`} />
        </Switch>
    )
}
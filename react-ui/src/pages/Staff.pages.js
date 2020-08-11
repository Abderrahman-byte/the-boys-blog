import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'

import { ProfilPage } from './Profil.page'
import { AuthContext } from '../context/AuthContext'

export const StaffPages = (props) => {
    const { user } = useContext(AuthContext)

    return (
        <Switch>
            <Route path='/staff/profil/'>
                <ProfilPage profil={user} />
            </Route>
        </Switch>
    )
}
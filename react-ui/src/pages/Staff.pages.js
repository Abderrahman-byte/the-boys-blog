import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ProfilPage } from './Profil.page'
import { AuthContext } from '../context/AuthContext'
import { PostPage } from './Post.page'
import { NotFound } from './NotFound'

export const StaffPages = ({match}) => {
    const { user } = useContext(AuthContext)
    
    return (
        <Switch>
            <Route path={`${match.path}/profil`}>
                <ProfilPage profil={user} />
            </Route>
            <Route exact path={`${match.path}/new-post`}>
                <PostPage create />
            </Route>

            <Route exact path={`${match.path}/edit-article/:id`}>
                <>
                    <span></span>    
                    <PostPage />
                </>
            </Route>
            
            <Redirect exact from={`${match.path}`} to={`${match.path}/profil`} />

            <Route component={NotFound} />
        </Switch>
    )
}
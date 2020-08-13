import React from 'react'
import { Switch, NavLink, useRouteMatch, Route, Redirect } from 'react-router-dom'

import '../styles/ProfilPage.scss'

import { ProfilHeader } from '../components/ProfilHeader'
import { ProfilAbout } from '../components/ProfilAbout'

export const ProfilPage = ({ profil }) => {
    const match = useRouteMatch()
    
    return (
        <div className='ProfilPage'>
            <ProfilHeader profil={profil} />
            <nav className='profil-nav'>
                <ul>
                    <li><NavLink to={`${match.path}/about`}>About</NavLink></li>
                    <li><NavLink to={`${match.path}/articles`}>Articles</NavLink></li>
                </ul>
            </nav>
            
            <div className='container'>
                <Switch>
                    <Route exact path={`${match.path}/about`}>
                        <ProfilAbout profil={profil} />
                    </Route>
                    {/* Articles profil page is missing  */}
                    <Redirect exact from={`${match.path}`} to={`${match.path}/about`} />
                </Switch>
            </div>

        </div>
    )
}
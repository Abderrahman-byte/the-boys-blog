import React, { useContext } from 'react'

import '../styles/ProfilAbout.scss'

import { AuthContext } from '../context/AuthContext'
import { EditAbout } from './EditAbout'

export const ProfilAbout = ({ profil }) => {
    const { user } = useContext(AuthContext)

    return (
        <div className='ProfilAbout'>
            <h4>About { profil.first_name }</h4>
            {user && user.id === profil.id ? (
                <EditAbout profil={profil}/>
            ) : (
                <p className='about'>{ profil.about.split('\n').map((t, i) => (<span key={i}>{t}</span>)) }</p>
            )}
            
        </div>
    )
}
import React, { lazy, useContext } from 'react'

import '../styles/ProfilHeader.scss'

import { EditAvatar } from './EditAvatar'
import { AuthContext } from '../context/AuthContext'

export const ProfilHeader = ({profil}) => {
    const { user } = useContext(AuthContext)

    return (
        <div className='ProfilHeader'>
            {user && profil.id === user.id? (
                <EditAvatar profil={profil} />
            ) : (
                <img className='avatar' src={`http://localhost:8000${profil.avatar}`} alt={`${profil.username} avatar`} />
            )} 
            

            <h3 className='name'>{profil.first_name} {profil.last_name}</h3>
            <p className='info'>{profil.staff_title} | Articles : {profil.articles_count}</p>
        </div>
    )
}
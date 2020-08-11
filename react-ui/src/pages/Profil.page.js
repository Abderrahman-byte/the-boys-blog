import React from 'react'
import { Switch } from 'react-router-dom'

import '../styles/ProfilPage.scss'

import { ProfilHeader } from '../components/ProfilHeader'

export const ProfilPage = ({profil}) => {
    console.log(profil)
    return (
        <div className='ProfilPage'>
            <ProfilHeader profil={profil} />
        </div>
    )
}
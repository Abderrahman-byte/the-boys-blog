import React from 'react'

import '../styles/ProfilAbout.scss'

export const ProfilAbout = ({ profil }) => {
    console.log(profil)
    return (
        <div className='ProfilAbout'>
            <h4>About { profil.first_name }</h4>
            <p className='about'>{ profil.about }</p>
        </div>
    )
}
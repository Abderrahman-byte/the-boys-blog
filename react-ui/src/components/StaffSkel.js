import React from 'react'

import '../styles/StaffCard.scss'
import '../styles/StaffSkel.scss'

export const StaffSkel = () => {

    return (
        <div className='StaffCard StaffSkel'>
            <div className='card-head'>
                <img className='avatar' src={`http://localhost:8000/media/users/skeleton.png`} alt='user card skeleton' />
            </div>
            <div className='card-foot'>
                <h6 className='name'></h6>
                <p className='title'></p>
                <p className='about'></p>
            </div>
        </div>
    )
}

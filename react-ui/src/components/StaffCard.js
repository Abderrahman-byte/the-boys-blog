import React from 'react'

import '../styles/StaffCard.scss'

export const StaffCard = ({ data }) => {
    
    return (
        <div className='StaffCard'>
            <div className='head'>
                <img src={`http://localhost:8000${data.avatar}`} alt={data.username} />
            </div>
            <div className='foot'>
                <h6 className='name'>{data.first_name} {data.last_name}</h6>
                {data.is_superuser ? <p className='admin'>admin</p>: null}
                <p className='title'>{data.staff_title}</p>
            </div>
        </div>
    )
}
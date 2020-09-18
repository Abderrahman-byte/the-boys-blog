import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/StaffCard.scss'

export const StaffCard = ({ data }) => {
    
    const renderAbout = (text) => {
        return text
        .split('\n')[0]
        .split(' ')
        .slice(0, 10)
        .join(' ')
        .replace(/\W/g, ' ')
        .replace(/\s+/, ' ')
    }

    return (
        <div className='StaffCard'>
            <div className='card-head'>
                <img className='avatar' src={`http://localhost:8000${data.avatar}`} alt={data.username} />
            </div>
            <div className='card-foot'>
                <h6 className='name'>{data.first_name} {data.last_name}</h6>
                {data.is_superuser ? <span className='admin'>admin</span>: null}
                <p className='title'>{data.staff_title}</p>
                { /* <div className='about'>{data.about.split('\n').map((line, i) => <p key={i}>{line}</p>)} </div> */ }
                <p className='about'>{renderAbout(data.about)}</p>
                <Link to={`/authors/${data.id}`} className='btn btn-primary btn-elt profil-btn'>Profil</Link>
            </div>
        </div>
    )
}

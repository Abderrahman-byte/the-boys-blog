import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/AuthorCard.scss'

export const AuthorCard = ({ author }) => {
    return (
        <div className='AuthorCard'>
            <img className='avatar' src={`http://localhost:8000${author.avatar}`} alt={`${author.first_name} ${author.last_name}`} />
            <div className='info'>
                <span className='title'>{author.first_name} {author.last_name}</span>
                <span className='staff'>{author.staff_title}</span>
                <p className='about'>{author.about.split('\n').map((t, i) => (<span key={i}>{t}</span>))}</p>
                <Link to={`/authors/${author.id}`} className='btn btn-primary'>Profil</Link>
            </div>
        </div>
    )
}
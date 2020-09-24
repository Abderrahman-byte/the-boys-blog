import React from 'react'

import '../styles/CommentSkelton.scss'

export const CommentSkelton = () => {
    return (
        <div className='CommentItem CommentSkelton'>
            <div className='profil'>
                <img className='avatar' src={`http://localhost:8000/media/users/skeleton.png`} alt='skeleton-avatar' />
                <span></span>
            </div>

            <div className='info'>
                <p className='name'></p>
                <p className='posted_date'></p>
                <div className='content'></div>
            </div>
        </div>
    )
}
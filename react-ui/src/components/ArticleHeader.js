import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/ArticleHeader.scss'

export const ArticleHeader = ({author}) => {
    console.log(author)

    return (
        <div className='ArticleHeader'>
            <img src={`http://localhost:8000${author.avatar}`} alt={author.username} />
            <div className='info'>
                <Link>{author.first_name} {author.last_name}</Link>
            </div>
        </div>
    )
}
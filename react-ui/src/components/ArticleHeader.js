import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/ArticleHeader.scss'

export const ArticleHeader = ({author, pubdate}) => {
    return (
        <div className='ArticleHeader'>
            <p>Published at {(new Date(pubdate)).toLocaleString()} <span>|</span> by <Link className='author'>{author.first_name} {author.last_name}</Link></p>
        </div>
    )
}
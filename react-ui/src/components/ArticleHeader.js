import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/ArticleHeader.scss'

export const ArticleHeader = ({author, pubdate}) => {
    return (
        <div className='ArticleHeader'>
            <div className='control'>
                <Link className='edit tooltip tooltip-right'  data-title='Edit Article'><i className='fas fa-cog'></i></Link>
                <Link className='delete tooltip tooltip-top' data-title='Delete Article'><i className='fas fa-trash'></i></Link>
            </div>
            <p>Published at {(new Date(pubdate)).toLocaleString()} <span>|</span> by <Link className='author'>{author.first_name} {author.last_name}</Link></p>
        </div>
    )
}
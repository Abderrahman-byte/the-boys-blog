import React from 'react'

import '../styles/ArticleSkel.scss'

export const ArticleSkel = () => {

    return (
        <div className='ArticleCard ArticleSkel'>
            <div className='header'>
                <img className='overview-img' src='http://localhost:8000/media/images/placeholder.jpg' alt='place holder' />
            </div>

            <div className='info'>
                <h6 className='title'></h6>
                <span className='date'></span>
                <p className='overview'></p>
            </div>

            <div className='footer'>
                <span className='comments'></span>
                <span className='hashtags'>
                    <span></span>
                    <span></span>
                </span>
            </div>
        </div>
    )
}
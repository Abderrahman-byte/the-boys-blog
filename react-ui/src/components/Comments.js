import React, { useState, useEffect, useContext } from 'react'

import '../styles/Comments.scss'
import { CommentsList } from './CommentsList'
import { CommentsContext } from '../context/CommentContext'

export const CommentsSection = () => {
    const { dataCount, data, isLoading, isMore, nextComments } = useContext(CommentsContext)
    
    useEffect(() => {
        console.log(dataCount)
    })

    return (
        <div className='CommentsSection'>
            <div className='comments-header'>
                <p>{dataCount} comment{dataCount !== 1 ? 's' : ''} </p>
            </div>

            {(data && data.length > 0) && (<CommentsList />)}
            
            {(isMore && isLoading) && (<p>...Loading</p>)}

            {(isMore && data.length > 0 && !isLoading) && (<button onClick={nextComments} className='btn btn-elt btn-primary more-btn'>More</button>)}
        </div>
    )
}
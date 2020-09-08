import React, { useContext } from 'react'

import '../styles/CommentsList.scss'

import { CommentItem } from './CommentItem'
import { CommentsContext } from '../context/CommentContext'

export const CommentsList = () => {
    const { data } = useContext(CommentsContext)

    return (
        <div className='CommentsList'>
            {data.map(item => <CommentItem key={item.id} data={item} />)}
        </div>
    )
}
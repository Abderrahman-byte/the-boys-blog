import React, { useContext } from 'react'

import '../styles/CommentsList.scss'

import { CommentItem } from './CommentItem'
import { CommentsContext } from '../context/CommentContext'
import { CommentSkelton } from './CommentSkelt'

export const CommentsList = () => {
    const { data, skelton } = useContext(CommentsContext)

    return (
        <div className='CommentsList'>
            {skelton && (<CommentSkelton />)}
            {data.map(item => <CommentItem key={item.id} data={item} />)}
        </div>
    )
}
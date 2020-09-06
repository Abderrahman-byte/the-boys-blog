import React from 'react'

import '../styles/CommentsList.scss'

import { CommentItem } from './CommentItem'

export const CommentsList = ({items}) => {

    return (
        <div className='CommentsList'>
            {items.map(item => <CommentItem key={item.id} data={item} />)}
        </div>
    )
}
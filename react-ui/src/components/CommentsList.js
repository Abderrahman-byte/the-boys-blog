import React, { useContext } from 'react'

import '../styles/CommentsList.scss'

import { CommentItem } from './CommentItem'
import { CommentsContext } from '../context/CommentContext'
import { CommentSkelton } from './CommentSkelt'

export const CommentsList = () => {
    const { data, skelton, isLoading, dataCount } = useContext(CommentsContext)

    const getHolders = () => {
        let len = 5
        if(data && dataCount && dataCount - data.length < 5 && dataCount - data.length > 0) {
            len = dataCount - data.length
        }
        let arr = Array(len).fill(1)
        return arr
    }

    return (
        <div className='CommentsList'>
            {skelton && (<CommentSkelton />)}
            {data.map(item => <CommentItem key={item.id} data={item} />)}
            {isLoading ? getHolders().map((item, i) => <CommentSkelton key={i} /> ) : null}
        </div>
    )
}
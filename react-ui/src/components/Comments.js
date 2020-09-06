import React, { useState } from 'react'

import '../styles/Comments.scss'
import { CommentsList } from './CommentsList'

export const CommentsSection = ({id, count}) => {
    const [currentPage, setPage] = useState(1)
    const [itemPerPage, setItemsPerPage] = useState(10)
    const [data, setData] = useState([])
    const [isMore, setMore] = useState(true)
    const [isLoading, setLoadingState] = useState(false)
    const [commentsCount, setCount] = useState(count)

    const getComments = async () => {
        setLoadingState(true)
        const offset = (itemPerPage * currentPage) - itemPerPage
        const url = `http://localhost:8000/api/comments/?id=${id}&limit=${itemPerPage}&offset=${offset}`
        const req = await fetch(url)

        if(req.status >= 200 && req.status < 300) {
            let response = null

            try { response = await req.json() }
            catch(err) { response = null }

            if(!response || response.length < itemPerPage) {
                setMore(false)
                if(!response) return
            }

            setData([...data, ...response])
        } else {
            setMore(false)
        }

        setLoadingState(false)
    }

    useState(() => {
        getComments()
    }, [currentPage])

    return (
        <div className='CommentsSection'>
            <div className='comments-header'>
                <p>{commentsCount} comment{commentsCount !== 1 ? 's' : ''} </p>
            </div>

            {(data && data.length > 0) && (<CommentsList items={data} />)}
            
            {(isMore && isLoading) && (<p>...Loading</p>)}
        </div>
    )
}
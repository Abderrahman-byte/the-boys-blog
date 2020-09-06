import React, { useState, useEffect } from 'react'

import '../styles/Comments.scss'
import { CommentsList } from './CommentsList'

export const CommentsSection = ({id, count}) => {
    const [currentPage, setPage] = useState(1)
    const [itemPerPage, setItemsPerPage] = useState(5)
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

            if(data.length + response.length >= commentsCount) setMore(false)

            setData([...data, ...response])
        } else {
            setMore(false)
        }

        setLoadingState(false)
    }

    const nextComments = () => {
        console.log("more has been clicked")
        setPage(currentPage + 1)
    }

    useEffect(() => {
        console.log("current page has been changed")
        getComments()
    }, [currentPage])

    return (
        <div className='CommentsSection'>
            <div className='comments-header'>
                <p>{commentsCount} comment{commentsCount !== 1 ? 's' : ''} </p>
            </div>

            {(data && data.length > 0) && (<CommentsList items={data} />)}
            
            {(isMore && isLoading) && (<p>...Loading</p>)}

            {(isMore && data.length > 0 && !isLoading) && (<button onClick={nextComments} className='btn btn-elt btn-primary more-btn'>More</button>)}
        </div>
    )
}
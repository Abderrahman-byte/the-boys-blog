import React, { useState, useEffect, useCallback, useContext } from 'react'

import '../styles/ArticleCard.scss'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const ArticleCard = ({data}) => {
    const { user } = useContext(AuthContext)
    const [contentBlock, setContent] = useState([])
    const [maxChars] = useState(200)
    const [overview, setOverview] = useState('')

    useEffect(() => {
        let content = null
        try { content = JSON.parse(data.content).blocks}
        catch(err) {content = []}

        setContent(content)
    }, [data])

    useEffect(() => {
        let res = ''
        let paragraphs = contentBlock && contentBlock.length > 0 ? 
        contentBlock.filter(block => block.type === 'paragraph').slice(0, 10) : []

        paragraphs.forEach(block => {
            if(res.length >= maxChars) return
            res += block.data.text.slice(0, maxChars - res.length)
        })

        setOverview(res + '...') 
    }, [contentBlock])
    
    return (
        <div className='ArticleCard'>
            <div className='header'>
                <Link to={`/articles/${data.id}`}>
                    <img className='overview-img' src={data.overview} alt={data.title} />
                </Link>

                {user && data && data.author.id === user.id ? (
                    <div className='controls'>
                        <Link className='edit' to={`/staff/edit-article/${data.id}`}><i className='fas fa-pen'></i> </Link>
                        <button className='delete'><i className='fas fa-trash-alt'></i> </button>
                    </div>
                ) : null}
            </div>

            <div className='info'>
                <h6 className='title'>{data.title}</h6>
                <span className='date'>Posted {(new Date(data.posted_date)).toLocaleString()} 
                <span className='bold'> | </span>by <Link to="#" className='author'>{data.author.first_name} {data.author.last_name}</Link></span>
                <p className='overview'>{overview} <Link className='read_btn' to={`/articles/${data.id}`}>Read More</Link></p>
            </div>

            <div className='footer'>
                <span className='comments'><i className="fas fa-comment-dots"></i> {data.comments_count} comment{data.comments_count !== 1 ? 's' : ''}</span>
                <span className='hashtags'>
                    <Link to='#'>#Hashtages_sepose_to_be_here</Link>
                    <Link to='#'>#Hashtages_sepose_to_be_here</Link>
                </span>
            </div>
        </div>
    )
}
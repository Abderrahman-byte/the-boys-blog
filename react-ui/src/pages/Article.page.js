import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import '../styles/ArticlePage.scss'
import { Article } from '../components/Article'
import { ArticleHeader } from '../components/ArticleHeader'
import { AuthorCard } from '../components/AuthorCard'

export const ArticlePage = ({setWallpaper, setTitle}) => {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [blocks, setBlocks] = useState(null)
    
    const getArticle = async () => {
        const req = await fetch(`http://localhost:8000/api/articles/${id}`)
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            setData(data)
        } else {
            console.log('Must redirect to 404')
        }
    }

    useEffect(() => {
        setWallpaper(null)
        setTitle(null)
        getArticle()
    }, [])

    useEffect(() => {
        if(data) {
            let content = {}
            try { content = JSON.parse(data.content) }
            catch(err) {
                console.error(err)
                content = {}
            }
            setBlocks(content.blocks || null)
            setWallpaper(data.overview)
            setTitle(data.title)  
        }
    }, [data])

    return (
        <div className='ArticlePage'>
            <div className='row'>
                <div className='content'>
                    {data && data.author ? (
                        <ArticleHeader author={data.author} pubdate={data.posted_date} />
                    ) : !blocks ? null : (
                        <div className='lds-ring center'><div></div><div></div><div></div><div></div></div>
                    )}

                    {blocks ? (<Article blocks={blocks} />) : (
                        <div className='lds-ring center'><div></div><div></div><div></div><div></div></div>
                    )}

                    {(data && data.author) && (<AuthorCard author={data.author} />)}
                </div>
                <div className='aside'>abderrahman</div>
            </div>
        </div>
    )
}
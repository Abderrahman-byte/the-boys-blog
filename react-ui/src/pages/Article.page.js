import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import '../styles/ArticlePage.scss'

import { Article } from '../components/Article'
import { ArticleHeader } from '../components/ArticleHeader'
import { AuthorCard } from '../components/AuthorCard'
import { CommentsSection } from '../components/Comments'

export const ArticlePage = ({setWallpaper, setTitle, setDefault}) => {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [blocks, setBlocks] = useState(null)
    
    const getArticle = async () => {
        const req = await fetch(`http://localhost:8000/api/articles/${id}`)
        if(req.status >= 200 && req.status < 300) {
            let content = {}
            const data = await req.json()

            try { content = JSON.parse(data.content) }
            catch(err) {
                console.error(err)
                content = {}
            }

            setData(data)
            setBlocks(content.blocks || null)
            setWallpaper(data.overview)
            setTitle(data.title)  
        } else {
            console.log('Must redirect to 404')
        }
    }

    useEffect(() => {
        setWallpaper(null)
        setTitle(null)
        getArticle()
    }, [])


    return (
        <div className='ArticlePage'>
            <div className='row'>
                <div className='content'>
                    {data && data.author ? (
                        <ArticleHeader author={data.author} pubdate={data.posted_date} id={id} setDefault={setDefault} />
                    ) : !blocks ? null : (
                        <div className='lds-ring center'><div></div><div></div><div></div><div></div></div>
                    )}

                    {blocks ? (<Article blocks={blocks} />) : (
                        <div className='lds-ring center'><div></div><div></div><div></div><div></div></div>
                    )}

                    {(data && data.author && blocks ) && (<AuthorCard author={data.author} />)}

                    {(data && data.id) && (<CommentsSection id={data.id} count={data.comments_count || 0} />)}
                </div>

                <div className='aside'>abderrahman</div>
            </div>
        </div>
    )
}
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { Article } from '../components/Article'
import { ArticleHeader } from '../components/ArticleHeader'
import { AuthorCard } from '../components/AuthorCard'
import { CommentsSection } from '../components/Comments'
import { CommentsProvider } from '../context/CommentContext'
import { SearchBar } from '../components/SearchBar'
import { RelatedArticles } from '../components/RelatedArticles'

export const ArticlePage = ({setWallpaper, setTitle, setDefault}) => {
    const { id } = useParams()
    const history = useHistory()

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

            if(data.author) {
                history.location.state = {...history.location.state, article_author: data.author}
            }
        } else {
            console.log(await req.json())
            history.replace('/NotFound')
        }
    }

    useEffect(() => {
        setData(null)
        setBlocks(null)
        setWallpaper(null)
        setTitle(null)
        getArticle()
    }, [id])

    return (
        <div className='ArticlePage'>
            <div className='row'>
                <div className='content'>
                    {data && data.author ? (
                        <ArticleHeader author={data.author} pubdate={data.posted_date} id={id} setDefault={setDefault} categories={data.categories} />
                    ) : !blocks ? null : (
                        <div className='lds-ring center'><div></div><div></div><div></div><div></div></div>
                    )}

                    {blocks ? (<Article blocks={blocks} />) : (
                        <div className='lds-ring center'><div></div><div></div><div></div><div></div></div>
                    )}

                    {(data && data.author && blocks ) && (<AuthorCard author={data.author} />)}

                    {(data && data.id ) && (
                        <CommentsProvider id={data.id} count={data.comments_count || 0}>
                            <CommentsSection />
                        </CommentsProvider>
                    )}
                </div>

                <div className='aside'>
                    <SearchBar />
                    
                    {data ? (
                        <RelatedArticles id={data.id} />
                    ): null }
                </div>
            </div>
        </div>
    )
}
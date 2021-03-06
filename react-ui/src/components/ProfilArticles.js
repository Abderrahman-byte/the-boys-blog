import React, { useState, useEffect } from 'react'

import '../styles/ProfilArticles.scss'

import { ArticlesList } from './ArticlesList'

export const ProfilArticles = ({profil}) => {
    const [data, setData] = useState([])
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(4)

    const [isMore, setMoreState] = useState(true)
    const [isLoading, setLoadingState] = useState(true)

    const getArticles = async () => {
        if(!profil || !profil.id || !profil.articles_count) {
            setMoreState(false)
            setLoadingState(false)
            return
        }

        setLoadingState(true)
        const offset = (itemsPerPage * currentPage) - itemsPerPage
        const req = await fetch(`http://localhost:8000/api/articles/?author=${profil.id}&limit=${itemsPerPage}&offset=${offset}`)
        
        if(req.status >= 200 && req.status < 300) {
            let response
            try { response = await req.json()}
            catch (err) { response = null}

            if(!response || response.length <= 0 ) {
                setMoreState(false)
            } else {
                setData([...data, ...response])
            }

            if(data.length + response.length >= profil.articles_count || response.length < itemsPerPage) {
                setMoreState(false)
            }
        } else {
            setMoreState(false)
        }
        setLoadingState(false)
    }

    const removeArticle = (id) => {
        setData([...data.filter(item => item.id !== id)])
    }
    
    const nextPage = () => {
        setPage(currentPage + 1)
    }

    useEffect(() => {
        if(isMore) {
            getArticles()
        }
    }, [currentPage])
    
    return (
        <div className='ProfilArticle'>
            {data && data.length > 0 ? <ArticlesList 
                data={data} 
                isLoading={isLoading} 
                itemsPerPage={itemsPerPage} 
                count={profil.articles_count} 
                removeItem={removeArticle}
            /> : null}

            {(!isLoading && !data) || (!isLoading && data.length <= 0) || (!isMore && data.length <= 0) ? (
                <div className='text-message center'>
                    <p>There is no articles in this profil page.</p>
                </div>
            ) : null }
        
            {isMore && !isLoading ? (<button className='btn btn-elt btn-primary more' onClick={nextPage}>More</button>) : null}
        </div>
    )
}
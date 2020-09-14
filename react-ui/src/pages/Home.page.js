import React, { useState, useContext, useEffect } from 'react'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'
import { Article } from '../components/Article'
import { ArticlesList } from '../components/ArticlesList'

export const HomePage = ({setDefault}) => {
    const { openModel, closeModel } = useContext(ModelsContext)

    const [data, setData] = useState([])
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const [isMore, setMoreState] = useState(true)
    const [isLoading, setLoadingState] = useState(true)

    const getArticles = async () => {
        openModel(<LoadingModel />, false)
        setLoadingState(true)
        const offset = (itemsPerPage * currentPage) - itemsPerPage
        const req = await fetch(`http://localhost:8000/api/articles/?limit=${itemsPerPage}&offset=${offset}`)
        
        if(req.status >= 200 && req.status < 300) {
            let response
            try { response = await req.json()}
            catch (err) { response = null}

            if(!response || response.length <= 0 ) {
                setMoreState(false)
            } else {
                setData([...data, ...response])
            }

            if(response.length < itemsPerPage) {
                setMoreState(false)
            }
        } else {
            setMoreState(false)
        }

        setLoadingState(false)
        setTimeout(closeModel, 1000)
    }

    const removeItem = (id) => {
        setData([...data.filter(article => article.id !== id)])
    }

    const nextPage = () => {
        setPage(currentPage + 1)
    }

    useEffect(() => {
        setDefault()
    }, [])

    useEffect(() => {
        getArticles()
    }, [currentPage])

    return (
        <div className='HomePage'>
            <div className='head'>
                <h2 className='title'>Latest Articles</h2>
            </div>
            <div className='row'>
                <div className='content'>
                    {data.length > 0 ? (<ArticlesList
                        data={data}
                        isLoading={isLoading}
                        itemsPerPage={itemsPerPage} 
                        removeItem={removeItem}
                        table={true}
                    />) : null}

                    {isMore && !isLoading ? (<button className='btn btn-elt btn-primary more' onClick={nextPage}>More</button>) : null}
                </div>
                <div className='aside'>abderrahman is here</div>
            </div>
        </div>
    )
}
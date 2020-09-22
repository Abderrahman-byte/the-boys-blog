import React, { useEffect, useState } from 'react'

import { ArticlesList } from './ArticlesList'

export const ArticlesSearch = ({ initData, count, query }) => {
    const [data, setData] = useState(() => [...initData])
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(4)

    const [isMore, setMoreState] = useState(() => initData && initData.length < count)
    const [isLoading, setLoadingState] = useState(false)

    const getArticlesData = async () => {
        if(!isMore) return
        setLoadingState(true)
        const params = `query=${query}&type=article&limit=${itemsPerPage}&offset=${(currentPage  - 1) * itemsPerPage}`
        const req = await fetch(`http://localhost:8000/api/search?${params}`)

        if(req.status >= 200 && req.status < 300) {
            const response = await req.json()
            console.log(response)
            if(response.articles && response.articles.data) {
                setData([...data, ...response.articles.data])
                if(response.articles.data.length < itemsPerPage || response.articles.data.length + data.length >= count) setMoreState(false)
            } else {
                setMoreState(false)
            }
        } else {
            setMoreState(false)
            console.log(await req.json())
        }

        setLoadingState(false)
    }

    const nextPage = () => {
        setPage(currentPage + 1)
    }

    useEffect(() => {
        setMoreState(() => initData && initData.length < count)
    }, [initData, count])

    useEffect(() => {
        if(currentPage > 1) {
            getArticlesData()
        }

    }, [currentPage])

    useEffect(() => console.log(data), [])

    return (
        <div className='ArticlesSearch'>
            <h3 className='section-header'>Articles :</h3>

            <ArticlesList
                data={data}
                isLoading={isLoading}
                itemsPerPage={itemsPerPage}
                count={count}
            />

            {isMore && !isLoading ? (
                <button onClick={nextPage} className='btn btn-primary btn-elt more-btn'>More</button>
            ) : null}
        </div>
    )
}
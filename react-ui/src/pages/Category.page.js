import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { ArticlesList } from '../components/ArticlesList'
import { LoadingModel } from '../components/LoadingModel'
import { ModelsContext } from '../context/ModelsContext'
import { SearchBar } from '../components/SearchBar'
import { TopArticles } from '../components/TopArticles'

export const CategoryPage = ({setDefault, setHeaderText, setWallpaperImg}) => {
    const history = useHistory()
    const { title } = useParams()
    const { openModel, closeModel } = useContext(ModelsContext)

    const [data, setData] = useState([])
    const [categoryTitle, setTitle] = useState(null)
    const [dataCount, setCount] = useState(null)

    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [isLoading, setloadingState] = useState(true)
    const [isMore, setMoreState] = useState(true)

    const getCategory = async () => {
        setloadingState(true)
        const offset = itemsPerPage * (currentPage - 1)
        const req = await fetch(`http://localhost:8000/api/categories/${title}?limit=${itemsPerPage}&offset=${offset}`)

        if(req.status >= 200 && req.status < 300) {
            const results = await req.json()
            const title = results['title']
            const count = results['items'] || 0
            const articles = results['articles'] || []

            if(dataCount !== count) setCount(count)
            if(categoryTitle !== title) setTitle(title)

            if((data.length + articles.length >= count) || articles.length < itemsPerPage) setMoreState(false)

            setData([...data, ...articles])
            setloadingState(false)
        } else {
            history.replace('/NotFound')
        }
        closeModel()
    }

    const removeItem = (id) => {
        setData([...data.filter(item => item.id !== id)])
    }

    const nextPage = () => {
        setPage(currentPage + 1)
    }

    useEffect(() => {
        setHeaderText(categoryTitle)
    }, [categoryTitle])

    useEffect(() => {
        getCategory()
    }, [currentPage])

    useEffect(() => {
        openModel(<LoadingModel />, false)
        setDefault()
        setHeaderText('')
    }, [])

    return (
        <div className='CategoryPage'>
            <div className='row'>
                <div className='content'>
                    {data && data.length > 0 ? (
                        <ArticlesList
                            data={data} 
                            isLoading={isLoading} 
                            count={dataCount || 5} 
                            table={false} 
                            itemsPerPage={itemsPerPage} 
                            removeItem={removeItem}
                        />
                    ) :null}

                    {isMore && !isLoading ? (
                        <button onClick={nextPage} className='btn btn-elt btn-primary'>More</button>
                    ) : null}
                </div>

                <div className='aside'>
                    <SearchBar />
                    
                    {data ? (
                        <TopArticles title='popular posts' sortby='views' />
                    ) : null }
                </div>
            </div>
        </div>
    )
}
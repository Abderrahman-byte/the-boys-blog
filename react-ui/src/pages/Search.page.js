import React, { useEffect, useState } from 'react'

import '../styles/SearchPage.scss'

import { useHistory } from 'react-router-dom'
import { CategoriesSearch } from '../components/CategoriesSearch'
import { SearchBar } from '../components/SearchBar'
import { StaffSearch } from '../components/StaffSearch'
import { ArticlesSearch } from '../components/ArticlesSearch'

export const SearchPage = ({setDefault}) => {
    const history = useHistory()
    const [query, setQuery] = useState(() => {
        const query = new URLSearchParams(history.location.search)
        return query.get('query')
    })

    const [isLoading, setLoadingState] = useState(true)

    const [articlesResults, setArticles] = useState([])
    const [articlesCount, setArticlesCount] = useState(0)

    const [staffResults, setStaff] = useState([])
    const [staffCount, setStaffCount] = useState(0)

    const [categoriesResults, setCategories] = useState([])
    const [categoriesCount, setCategoriesCount] = useState(0)

    const getSearch = async () => {
        setLoadingState(true)
        const params = `${query}&type=staff&type=article&type=category&limit=4&offset=0&staff_limit=3&staff_offset=0`
        const req = await fetch(`http://localhost:8000/api/search?query=${params}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            if(data.articles && data.articles.count > 0 && data.articles.data) {
                setArticles(data.articles.data)
                setArticlesCount(data.articles.count)
            }

            if(data.staff && data.staff.count > 0 && data.staff.data) {
                setStaff(data.staff.data)
                setStaffCount(data.staff.count)
            }

            if(data.categories && data.categories.count > 0 && data.categories.data) {
                setCategories(data.categories.data)
                setCategoriesCount(data.categories.count)
            }
        } else {
            // console.error(await req.json())
        }
        setLoadingState(false)
    }

    useEffect(() => {
        getSearch()
    }, [])

    return (
        <div className='SearchPage'>
            <div className='head'>
                <h2 className='title'>Search Results For "{query}"</h2>
            </div>

            <div className='row'>
                <div className='content'>
                    {categoriesResults && categoriesResults.length > 0 ? (
                        <CategoriesSearch data={categoriesResults} />
                    ) : null}
                    
                    {staffResults && staffResults.length > 0 ? (
                        <StaffSearch initData={staffResults} count={staffCount} query={query} />
                    ) : null}

                    {articlesResults && articlesResults.length > 0 ? (
                        <ArticlesSearch initData={articlesResults} count={articlesCount} query={query} />
                    ) : null}

                    {!isLoading && articlesCount <= 0 && staffCount <= 0 && categoriesCount <= 0 ? (
                        <div className='Empty'>
                            <p>There is no results for "{query}"</p>
                        </div>
                    ) : null}
                </div>
                <div className='aside'>
                    <SearchBar initQuery={query} />
                </div>
            </div>
        </div>
    )
}
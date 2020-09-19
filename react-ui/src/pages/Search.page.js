import React, { useEffect, useMemo, useState } from 'react'

import '../styles/SearchPage.scss'

import { useHistory, useRouteMatch } from 'react-router-dom'
import { CategoriesSearch } from '../components/CategoriesSearch'
import { SearchBar } from '../components/SearchBar'

export const SearchPage = ({setDefault}) => {
    const history = useHistory()
    const [query, setQuery] = useState(() => {
        const query = new URLSearchParams(history.location.search)
        return query.get('query')
    })

    const [articlesResults, setArticles] = useState([])
    const [articlesCount, setArticlesCount] = useState(0)

    const [staffResults, setStaff] = useState([])
    const [staffCount, setStaffCount] = useState(0)

    const [categoriesResults, setCategories] = useState([])
    const [categoriesCount, setCategoriesCount] = useState(0)

    const getSearch = async () => {
        const params = `${query}&type=staff&type=article&type=category&limit=5&offset=0`
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
            console.log(await req.json())
        }
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

                </div>
                <div className='aside'>
                    <SearchBar initQuery={query} />
                </div>
            </div>
        </div>
    )
}
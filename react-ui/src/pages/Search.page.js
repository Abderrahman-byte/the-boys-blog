import React, { useEffect, useMemo, useState } from 'react'

import { useHistory, useRouteMatch } from 'react-router-dom'
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

    const [CategoriesResults, setCategories] = useState([])
    const [CategoriesCount, setCategoriesCount] = useState(0)

    const getSearch = async () => {
        const params = `${query}&type=staff&type=article&type=category&limit=5&offset=0`
        const req = await fetch(`http://localhost:8000/api/search?query=${params}`)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            console.log(data)
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
                    
                </div>
                <div className='aside'>
                    <SearchBar initQuery={query} />
                </div>
            </div>
        </div>
    )
}
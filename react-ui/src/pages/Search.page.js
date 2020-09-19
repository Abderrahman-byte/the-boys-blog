import React, { useEffect, useMemo, useState } from 'react'

import { useHistory, useRouteMatch } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'

export const SearchPage = ({setDefault}) => {
    const history = useHistory()
    const [query, setQuery] = useState(() => {
        const query = new URLSearchParams(history.location.search)
        return query.get('query')
    })

    useEffect(() => {
        console.log(query)
    }, [query])

    return (
        <div className='SearchPage'>
            <div className='row'>
                <div className='content'></div>
                <div className='aside'>
                    <SearchBar />
                </div>
            </div>
        </div>
    )
}
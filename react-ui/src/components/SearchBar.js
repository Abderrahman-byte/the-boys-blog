import React, { useState } from 'react'

import '../styles/SearchBar.scss'

export const SearchBar = ({initQuery}) => {
    const [query, setQuery] = useState(initQuery || '')

    const handleSubmit = e => query === '' ? e.preventDefault() : null

    return (
        <form onSubmit={handleSubmit} action='/search' className='SearchBar'>
            <input 
                type='text'
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder='Type your search pattern'
                name='query'
            />
            <button className='submit-btn'>
                <i className="fas fa-search"></i>
            </button>
        </form>
    )
}
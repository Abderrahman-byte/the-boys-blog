import React, { useState } from 'react'

import '../styles/SearchBar.scss'

export const SearchBar = () => {
    const [query, setQuery] = useState('')

    return (
        <form className='SearchBar'>
            <input 
                type='text'
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder='Type your search pattern'
            />
            <button className='submit-btn'>
                <i className="fas fa-search"></i>
            </button>
        </form>
    )
}
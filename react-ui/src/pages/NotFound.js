import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/NotFound.scss'

export const NotFound = () => {
    return (
        <div className='NotFound'>
            <h1>Error</h1>
            <span className='status'>404</span>
            <p className='msg'>The page requested was not found</p>
            <Link className='btn btn-elt btn-primary' to='/'>Return Home</Link>
        </div>
    )
}
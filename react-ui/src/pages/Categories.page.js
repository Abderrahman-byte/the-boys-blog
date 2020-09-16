import React from 'react'

export const CategoriesPage = ({setDefault, setHeaderText, setWallpaperImg}) => {
    return (
        <div className='CategoriesPage'>
            <div className='head'>
                <h2 className='title'>Categories</h2>
            </div>
            <div className='row'>
                <div className='content'></div>
                <div className='aside'></div>
            </div>
        </div>
    )
}
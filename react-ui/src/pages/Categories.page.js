import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'

import '../styles/CategoriesPage.scss'

import { CategoriesContext } from '../context/CategoriesContext'

export const CategoriesPage = ({setDefault, setHeaderText, setWallpaperImg}) => {
    const { categoriesList } = useContext(CategoriesContext)

    const getItems = () => {
        return categoriesList.map(item => {
            if(item.items <= 0) {
                return (
                    <div key={item.id} className='category'>
                        <p className='title'>{item.title} </p>
                        <span className='count'>{item.items}</span>
                    </div>
                )
            } else {
                return (
                    <Link to={`/category/${item.short_title}`} key={item.id} className='category'>
                        <p className='title'>{item.title} </p>
                        <span className='count'>{item.items}</span>
                    </Link>
                )
            }
        })
    }

    useEffect(() => {
        setDefault()
        setHeaderText('categories')
    }, [])

    return (
        <div className='CategoriesPage'>
            <div className='row'>
                <div className='content'>
                    <div className='categories-list'>
                        {getItems()}
                    </div>
                </div>
                <div className='aside'></div>
            </div>
        </div>
    )
}
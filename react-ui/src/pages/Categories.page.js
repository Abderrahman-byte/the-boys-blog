import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'

import '../styles/CategoriesPage.scss'

import { CategoriesContext } from '../context/CategoriesContext'
import { ModelsContext } from '../context/ModelsContext'
import { WarningModel } from '../components/WarningModel'
import { SearchBar } from '../components/SearchBar'
import { TopArticles } from '../components/TopArticles'

export const CategoriesPage = ({setDefault, setHeaderText, setWallpaperImg}) => {
    const { categoriesList } = useContext(CategoriesContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const emptyCategoryWarn = () => {
        openModel(<WarningModel text="Category page doesn't exists because there is no article in it." />, true)
        setTimeout(closeModel, 5000)
    }

    const getItems = () => {
        return categoriesList.map(item => {
            if(item.items <= 0) {
                return (
                    <div onClick={emptyCategoryWarn} key={item.id} className='category'>
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
                <div className='aside'>
                    <SearchBar />
                    
                    {categoriesList ? (
                        <TopArticles title='latest posts' sortby='posted_date' />
                    ) : null }
                </div>
            </div>
        </div>
    )
}
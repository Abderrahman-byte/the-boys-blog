import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { ModelsContext } from '../context/ModelsContext'
import { CategoryItem } from './CategoryItem'
import { WarningModel } from './WarningModel'

export const CategoriesSearch = ({ data }) => {
    const { openModel, closeModel } = useContext(ModelsContext)

    const emptyCategoryWarn = () => {
        openModel(<WarningModel text="Category page doesn't exists because there is no article in it." />, true)
        setTimeout(closeModel, 5000)
    }

    const getItems = () => {
        return data.map(item => {
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

    return (
        <div className='CategoriesSearch CategoriesPage'>
            <h3 className='section-header'>Categories :</h3>

            <div className='categories-list'>
                {getItems()}
            </div>
        </div>
    )
}
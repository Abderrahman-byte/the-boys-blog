import React, { useContext, useEffect, useState } from 'react'

import '../styles/ArticleCategories.scss'

import { CategoriesContext } from '../context/CategoriesContext'

export const ArticleCategories = ({init, setGlobal}) =>  {
    const { categoriesList } = useContext(CategoriesContext)
    const [categoriesIds, setCategoriesIds]  = useState(init)

    const compare = (arr1, arr2) => {
        if(!(arr1 instanceof Array)) return false
        if(!(arr2 instanceof Array)) return false
        return arr1.length  === arr2.length && arr1.every(v => arr2.includes(v)) && arr2.every(v => arr1.includes(v))
    }

    const toggleCategory = (id) => {
        if(categoriesIds.includes(id)) {
            setCategoriesIds([...categoriesIds.filter(v => v !== id)])
        } else {
            if(categoriesIds.length >= 5) return
            setCategoriesIds([...categoriesIds, id])
        }
    }

    const renderItems = () => {
        return (categoriesList || [])
        .map((category, index) => {
            return (
                <div key={category.id} className={`item ${categoriesIds.includes(category.id)? 'selected' : ''}`} 
                onClick={() => toggleCategory(category.id)}>
                    <p>{category.title}</p>
                </div>
            )
        })
    }

    useEffect(() => {
        if(!compare(init, categoriesIds)) {
            setCategoriesIds(init)
        }
    }, [init])

    useEffect(() => {
        if(!compare(init, categoriesIds)) {
            setGlobal(categoriesIds)
        }
    }, [categoriesIds])

    return (
        <div className='ArticleCategories'>
            <label>Select categories :</label>
            <div className='items-container'>
                {renderItems()}
            </div>
            <p className='warn'><span>Max = 5</span> <span>{categoriesIds.length}/5</span></p>
        </div>
    )
}
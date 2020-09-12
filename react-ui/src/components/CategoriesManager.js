import React, { useContext } from 'react'

import '../styles/CategoriesManager.scss'

import { CategoriesContext } from '../context/CategoriesContext'
import { CategoryItem } from './CategoryItem'

export const CategoriesManager = () => {
    const { categoriesList } = useContext(CategoriesContext)
    
    return (
        <div className='CategoriesManager'>
            <div className='header'>
                <h2>Manage Categories :</h2>
            </div>


            <div className='categories-list'>
                {categoriesList.length <= 0 ? (
                    <p className='msg'>There no categories registred !</p>
                ) : (
                    categoriesList.map(cat => <CategoryItem key={cat.id} data={cat} />)
                )}
            </div>

            
        </div>
    )
}
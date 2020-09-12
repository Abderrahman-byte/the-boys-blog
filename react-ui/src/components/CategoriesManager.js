import React, { useContext } from 'react'

import '../styles/CategoriesManager.scss'

import { CategoriesContext } from '../context/CategoriesContext'
import { CategoryItem } from './CategoryItem'
import { AddCategoryForm } from './AddCategoryForm'

export const CategoriesManager = () => {
    const { categoriesList } = useContext(CategoriesContext)
    
    return (
        <div className='CategoriesManager'>
            <div className='header'>
                <h2>Global Categories :</h2>
            </div>


            <div className='categories-list'>
                {categoriesList.length <= 0 ? (
                    <p className='msg'>There no categories registred !</p>
                ) : (
                    categoriesList.map(cat => <CategoryItem key={cat.id} data={cat} />)
                )}
            </div>

            <AddCategoryForm />
        </div>
    )
}
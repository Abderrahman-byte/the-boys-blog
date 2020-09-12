import React from 'react'
import { CategoriesProvider } from '../context/CategoriesContext'

export const ManageCategoriesPage = () => {

    return (
        <CategoriesProvider>
            <div>...you can manage CATEGORIES - Coming soon</div>
        </CategoriesProvider>
    )
}
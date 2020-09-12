import React from 'react'
import { CategoriesProvider } from '../context/CategoriesContext'
import { CategoriesManager } from '../components/CategoriesManager'

export const ManageCategoriesPage = () => {

    return (
        <CategoriesProvider>
            <CategoriesManager />
        </CategoriesProvider>
    )
}
import React, { createContext, useState, useEffect, useContext } from 'react'

import { ModelsContext } from './ModelsContext'
import { LoadingModel} from '../components/LoadingModel'
import { AuthContext } from './AuthContext'

export const CategoriesContext = createContext({})

export const CategoriesProvider = ({children}) => {
    const { user, token } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    const [categoriesList, setCategoriesData] = useState([])
    
    const getCategories = async () => {
        openModel(<LoadingModel />, false)
        const req = await fetch('http://localhost:8000/api/categories/')
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            setCategoriesData(data)
        }
        setTimeout(closeModel, 1000)
    }

    const deleteCategory = async (id) => {
        if(!user || !token || !user.id) return
        const req = await fetch(`http://localhost:8000/api/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            console.log('deleted', id)
            setCategoriesData([...categoriesList.filter(item => item.id !== id)]) 
        }
    }

    useEffect(() => {
        getCategories()    
    }, [])

    return (
        <CategoriesContext.Provider value={{categoriesList, deleteCategory}}>
            {children}
        </CategoriesContext.Provider>
    )
}
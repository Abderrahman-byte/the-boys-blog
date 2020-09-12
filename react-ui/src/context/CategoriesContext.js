import React, { createContext, useState, useEffect, useContext } from 'react'

import { ModelsContext } from './ModelsContext'
import { LoadingModel} from '../components/LoadingModel'

export const CategoriesContext = createContext({})

export const CategoriesProvider = ({children}) => {
    const { openModel, closeModel } = useContext(ModelsContext)
    const [categoriesList, setCategoriesData] = useState([])
    
    const getCategories = async () => {
        openModel(<LoadingModel />, false)
        const req = await fetch('http://localhost:8000/api/categories/')
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            console.log(data)
            setCategoriesData(data)
        }
        setTimeout(closeModel, 1000)
    }

    useEffect(() => {
        getCategories()    
    }, [])

    return (
        <CategoriesContext.Provider values={{}}>
            {children}
        </CategoriesContext.Provider>
    )
}
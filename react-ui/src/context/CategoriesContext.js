import React, { createContext } from 'react'

export const CategoriesContext = createContext({})

export const CategoriesProvider = ({children}) => {
    return (
        <CategoriesContext.Provider values={{}}>
            {children}
        </CategoriesContext.Provider>
    )
}
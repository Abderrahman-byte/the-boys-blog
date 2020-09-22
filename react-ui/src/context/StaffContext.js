import React, { createContext, useContext, useEffect, useState } from 'react'

import { AuthContext } from './AuthContext'
import { ModelsContext } from './ModelsContext'
import { LoadingModel } from '../components/LoadingModel'

export const StaffContext = createContext({})

export const StaffProvider = ({children}) => {
    const { user, token } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const [data, setData] = useState([])
    
    const getStaff = async () => {
        openModel(<LoadingModel />, false)

        const req = await fetch(`http://localhost:8000/api/staff?limit=1000`)

        if(req.status >= 200 && req.status < 300) {
            const result = await req.json()
            if(result && result.data && result.count > 0) setData([...result.data])
        } else {
            console.log(await req.json())
        }
        closeModel()
    }

    useEffect(() => {
        getStaff()
    }, [])

    return (
        <StaffContext.Provider value={{ staff: data }}>
            {children}
        </StaffContext.Provider>
    )
}
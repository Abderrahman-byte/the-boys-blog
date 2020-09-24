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

    const removeFromStaff = async (id) => {
        const payload = {staff_title: null, is_superuser: false, is_staff: false, about: null}
        const req = await fetch(`http://localhost:8000/api/user-info/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            setData([...data.filter(item => item.id !== id)])
        }
        else {
            console.error(await req.json())
        }
    }

    const editStaff = async (id, payload) => {
        const req = await fetch(`http://localhost:8000/api/user-info/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            const res = await req.json()
            const dataClone = data.map(item => {
                if(item.id === id) return res
                return item
            })
            setData([...dataClone])
            return [true, null]
        }
        else {
            const data = await req.json()
            console.error(data)
            return [false, data.details ? data.details: 'Something went wrong']
        }
    }

    const addStaff = async (payload) => {
        const req = await fetch(`http://localhost:8000/api/staff/add`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            const res = await req.json()
            console.log(res)
            setData([...data, res])
            return [true, null]
        }
        else {
            const data = await req.json()
            console.error(data)
            return [false, data.details ? data.details: 'Something went wrong']
        }
    }

    useEffect(() => {
        getStaff()
    }, [])

    return (
        <StaffContext.Provider value={{ removeFromStaff, editStaff, addStaff, staff: data }}>
            {children}
        </StaffContext.Provider>
    )
}
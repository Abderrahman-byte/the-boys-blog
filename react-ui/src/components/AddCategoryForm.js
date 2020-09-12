import React, { useState, useContext } from 'react'

import '../styles/AddCategoryForm.scss'

import { CategoriesContext } from '../context/CategoriesContext'
import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'

export const AddCategoryForm = () => {
    const { categoriesList, addCategory } = useContext(CategoriesContext)
    const { user, token } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const [title, setTitle] = useState('')
    const [shortTitle, setShortTitle] = useState('')

    const [errors, setErrors] = useState([])

    const createCategory = async () => {
        if(!user || !token || !user.id || !user.is_superuser) return

        openModel(<LoadingModel />, false)
        const req = await fetch('http://localhost:8000/api/categories/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({'title': title, 'short_title': shortTitle})
        })

        if(req.status >= 200 && req.status < 300) {
            let data = null
            try { data = await req.json()}
            catch (err) { data = null}

            if(data === null) {
                setErrors(['something went wrong, please try later!'])
            } else {
                addCategory(data)
                setShortTitle('')
                setTitle('')
                setErrors([])
            }
        }

        closeModel()
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(title === '') {
            setErrors(['The name field is required'])
            return
        } else if(shortTitle === '') {
            setErrors(['The short name field is required'])
            return
        }

        if(categoriesList.some(item => item.title.toLowerCase() === title.toLowerCase())) {
            setErrors(['The category name is already present'])
        } else if (categoriesList.some(item => item.short_title.toLowerCase() === shortTitle.toLowerCase())) {
            setErrors(['The category short title is already present'])
        } else {
            createCategory()
        }
    }

    return (
        <form className='AddCategoryForm' onSubmit={handleSubmit}>
            <div className='form-header'>
                <h6>Add New Categories</h6>
            </div>
            <div className='form-group'>
                <input 
                    type='text' 
                    className='form-control' 
                    placeholder='Full category name' 
                    value={title}
                    onChange={e => {
                        setTitle(e.target.value)
                        setErrors([])
                    }}
                />
                <small>Full category name. examples : Linux System Administration, Databases Administration</small>
            </div>
            <div className='form-group'>
                <input 
                    type='text' 
                    className='form-control' 
                    placeholder='Short name' 
                    value={shortTitle}
                    onChange={e => {
                        let str = e.target.value.replace(/\s+/g, '-').replace(/\-+/, '-')
                        setShortTitle(str)
                        setErrors([])
                    }}
                    maxLength={17}
                />
                <small>Bref name to be used in urls. examples : linux-sysadmin, web-design</small>
            </div>
            
            {errors.length > 0 ? (
                <div className='error-div'>
                    {errors.map((v, i) => <p key={i}>{v}</p>)}
                </div>
            ): null}

            <button className='btn btn-elt btn-primary save'>Save</button>
        </form>
    )
}
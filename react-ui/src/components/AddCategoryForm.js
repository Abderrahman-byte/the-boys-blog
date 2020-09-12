import React, { useState } from 'react'

import '../styles/AddCategoryForm.scss'

export const AddCategoryForm = () => {
    const [title, setTitle] = useState('')
    const [shortTitle, setShortTitle] = useState('')

    const [errors, setErrors] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()
        
    }

    return (
        <form className='AddCategoryForm'>
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

            <div className='error-div'>
                <p>This is error</p>
            </div>

            <button className='btn btn-elt btn-primary save'>Save</button>
        </form>
    )
}
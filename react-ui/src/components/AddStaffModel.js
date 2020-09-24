import React, { useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/AddStaffModel.scss'

export const AddStaffModel = ({initData, callback, initError}) => {
    const [username, setUsername] = useState(() => initData && initData.username ? initData.username : '' )
    const [staffTitle, setStaffTitle] = useState(() => initData && initData.staff_title ? initData.staff_title : '' )

    const [usernameError, setUsernameError] = useState(null)
    const [titleError, setTitleError] = useState(null)

    const checkUsername= () => {
        if(username === '') {
            setUsernameError('Username field is required')
            return false
        }

        return true
    }

    const checkTitle = () => {
        if(staffTitle === '') {
            setTitleError('Staff title field is required')
            return false
        } 

        if(staffTitle.length < 3) {
            setTitleError('Staff title field must contains at least 3 characteres')
            return false
        }

        if(/.*\d.*/.test(staffTitle)) {
            setTitleError('Staff title musnt contains only letters')
            return false
        }

        return true
    }

    const handleSubmit = e => {
        e.preventDefault()

        const titleVericated = checkTitle()
        const nameVericated = checkUsername()

        if(titleVericated && nameVericated) {
            const payload = {username, staff_title: staffTitle}
            console.log(payload)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='AddStaffModel'>
            <div className='form-header'>
                <h6>Add New Staff</h6>
            </div>

            <div className={`form-group${usernameError ? ' error':''}`}>
                <input
                    type='text'
                    className='form-control'
                    value={username}
                    placeholder='Username of an existing user'
                    onChange={e => {
                        setUsernameError(null)
                        setStaffTitle(e.target.value)
                    }}
                />
                {usernameError ? (
                    <small>
                        <p>{usernameError}</p>
                    </small>
                ) : null}
            </div>

            <div className={`form-group${titleError ? ' error':''}`}>
                <input
                    type='text'
                    className='form-control'
                    value={staffTitle}
                    placeholder='Staff Title'
                    onChange={e => {
                        setTitleError(null)
                        setStaffTitle(e.target.value)
                    }}
                />
                {titleError ? (
                    <small>
                        <p>{titleError}</p>
                    </small>
                ) : null}
            </div>
            
            {initError ? (
                <div className='error-div'>
                    {initError}
                </div>  
            ) :null}

            <button className='submit'>Save</button>
        </form>
    )
}

AddStaffModel.propTypes = {
    initData: PropTypes.object, 
    callback: PropTypes.func.isRequired,
    initError: PropTypes.string
}
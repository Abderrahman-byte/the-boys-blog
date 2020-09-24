import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/StaffFormModel.scss'

import { ModelsContext } from '../context/ModelsContext'

export const StaffFormModel = ({data, callback, initError}) => {
    const { closeModel } = useContext(ModelsContext)

    const [staffTitle, setTitle] = useState(() => data && data.staff_title ? data.staff_title : '')
    const [firstName, setFirstName] = useState(() => data && data.first_name ? data.first_name : '')
    const [lastName, setLastName] = useState(() => data && data.last_name ? data.last_name : '')
    const [isSuperuser, setIsSuperUser] = useState(() => data && data.is_superuser ? data.is_superuser : false)
    
    const [titleError, setTitleError] = useState(null)
    const [firstNameError, setFirstNameError] = useState(null)
    const [lastNameError, setLastNameError] = useState(null)

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

    const checkFirstName = () => {
        if(firstName === '') {
            setFirstNameError('First name field is required')
            return false
        } 

        if(firstName.length < 3) {
            setFirstNameError('First name field must contains at least 3 characteres')
            return false
        }

        if(/.*\d.*/.test(firstName)) {
            setFirstNameError('First name musnt contains only letters')
            return false
        }

        return true
    }

    const checkLastName = () => {
        if(lastName === '') {
            setLastNameError('Last name field is required')
            return false
        } 

        if(lastName.length < 3) {
            setLastNameError('Last name field must contains at least 3 characteres')
            return false
        }

        if(/.*\d.*/.test(lastName)) {
            setLastNameError('Last name musnt contains only letters')
            return false
        }

        return true
    }

    const isChanged = () => {
        return !(data.is_superuser === isSuperuser 
        && data.first_name === firstName 
        && data.last_name === lastName 
        && data.staff_title === staffTitle)
    }

    const handelSubmit = (e) => {
        e.preventDefault()

        const titleIsVerified = checkTitle()
        const firstNameIsVerified = checkFirstName()
        const lastNameIsVerified = checkLastName()

        if(!isChanged()) {
            closeModel()
            return
        }

        if(titleIsVerified && firstNameIsVerified && lastNameIsVerified) {
            const payload = {is_superuser: isSuperuser, first_name: firstName, last_name: lastName, staff_title: staffTitle}
            callback(payload)
        }
    }

    return (
        <form onSubmit={handelSubmit} className='StaffFormModel'>
            <div className='form-header'>
                <h6>Edit Staff Member</h6>
            </div>

            <div className={`form-group${firstNameError?' error':''}`}>
                <input 
                    className='form-control'
                    name='first_name' 
                    placeholder='First Name' 
                    value={firstName}
                    onChange={e => {
                        setFirstNameError(null)
                        setFirstName(e.target.value)
                    }}
                />
                {firstNameError ? (<small>{firstNameError}</small>) : null}
            </div>

            <div className={`form-group${lastNameError?' error':''}`}>
                <input 
                    className='form-control'
                    name='last_name' 
                    placeholder='Last Name' 
                    value={lastName}
                    onChange={e => {
                        setLastNameError(null)
                        setLastName(e.target.value)
                    }}
                />
                {lastNameError ? (<small>{lastNameError}</small>) : null}
            </div>

            <div className={`form-group${titleError?' error':''}`}>
                <input 
                    className='form-control'
                    name='staff_title' 
                    placeholder='Staff Title'
                    value={staffTitle}
                    onChange={e => {
                        setTitleError(null)
                        setTitle(e.target.value)
                    }}
                />
                {titleError ? (<small>{titleError}</small>) : null}
            </div>

            <div className='form-group'>
                <label className='inline'>Admin :</label>
                <input type='checkbox' checked={isSuperuser} 
                onChange={e => setIsSuperUser(e.currentTarget.checked)} />
            </div>
            
            {initError ? (
                <div className='error-div'>
                    <p>{initError}</p>
                </div>
            ) : null}

            <button className='submit'>Save</button>
        </form>
    )
}

StaffFormModel.propTypes = {
    data: PropTypes.object,
    callback: PropTypes.func.isRequired,
    initError: PropTypes.string
}
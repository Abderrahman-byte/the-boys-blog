import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import '../styles/StaffFormModel.scss'

export const StaffFormModel = ({data}) => {
    const [staffTitle, setTitle] = useState(() => data && data.staff_title ? data.staff_title : '')
    const [firstName, setFirstName] = useState(() => data && data.first_name ? data.first_name : '')
    const [lastName, setLastName] = useState(() => data && data.last_name ? data.last_name : '')
    const [isSuperuser, setIsSuperUser] = useState(() => data && data.is_superuser ? data.is_superuser : false)

    useEffect(() => {
        console.log(data)
    }, [])
    
    return (
        <form className='StaffFormModel'>
            <div className='form-header'>
                <h6>Edit Staff Member</h6>
            </div>

            <div className='form-group'>
                <input 
                    className='form-control' 
                    name='first_name' 
                    placeholder='First Name' 
                    value={firstName}
                    onChange={() => setFirstName(e => e.target.value)}
                    />
            </div>

            <div className='form-group'>
                <input 
                    className='form-control' 
                    name='last_name' 
                    placeholder='Last Name' 
                    value={lastName}
                    onChange={() => setLastName(e => e.target.value)}
                    />
            </div>

            <div className='form-group'>
                <input 
                    className='form-control' 
                    name='staff_title' 
                    placeholder='Staff Title'
                    value={staffTitle}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <label>Admin :</label>
                <select className='form-select' value={isSuperuser ? 2 : 1 } 
                onChange={e => Number(e.target.value) === 2 ? setIsSuperUser(true) : setIsSuperUser(false)}>
                    <option value={1}>No</option>
                    <option value={2}>Yes</option>
                </select>
            </div>

            <button className='submit'>Save</button>
        </form>
    )
}

StaffFormModel.propTypes = {
    data: PropTypes.object
}
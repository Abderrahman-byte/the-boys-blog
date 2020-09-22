import React from 'react'
import { StaffProvider } from '../context/StaffContext'

import '../styles/ManageStaff.scss'

import { Stafflist } from '../components/StaffList'

export const ManageStaff = () => {
    
    return (
        <div className='ManageStaff'>
            <StaffProvider>
                <Stafflist />
            </StaffProvider>
        </div>
    )
}
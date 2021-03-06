import React, { useContext } from 'react'
import { ModelsContext } from '../context/ModelsContext'
import { StaffContext } from '../context/StaffContext'

import '../styles/StaffList.scss'

import { AddStaffModel } from './AddStaffModel'
import { LoadingModel } from './LoadingModel'
import { StaffTableItem } from './StaffTableItem'

export const Stafflist = () => {
    const { staff, addStaff } = useContext(StaffContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    
    const AddStaff = () => {
        const callback = async (payload) => {
            openModel(<LoadingModel />, false)
            const [success, errorText] = await addStaff(payload)
            if(success) {
                closeModel()
            } else {
                openModel(<AddStaffModel initData={payload} callback={callback} initError={errorText} />, true)
            }
        }

        openModel(<AddStaffModel callback={callback} />, true)
    }

    return (
        <table className='StaffList'>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Title</th>
                    <th>Admin</th>
                    <th>Join Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {staff.map(item => <StaffTableItem data={item} key={item.id} />)}
                {staff && staff.length <= 0 ? (
                    <tr>
                        <td colSpan='7' className='message'><p>There is no staff members</p></td>
                    </tr>
                ) : null}

                <tr className='last-row'>
                    <td colSpan='5'></td>
                    <td>
                        <button onClick={AddStaff} className='add-btn'><i className='fas fa-plus'></i> add staff</button>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    )
}
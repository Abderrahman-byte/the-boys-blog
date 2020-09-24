import React, { useContext } from 'react'
import { StaffContext } from '../context/StaffContext'

import '../styles/StaffList.scss'

import { StaffTableItem } from './StaffTableItem'

export const Stafflist = () => {
    const { staff } = useContext(StaffContext)

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
            </tbody>
        </table>
    )
}
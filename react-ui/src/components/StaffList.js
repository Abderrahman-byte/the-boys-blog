import React, { useContext } from 'react'
import { StaffContext } from '../context/StaffContext'

import '../styles/StaffList.scss'

export const Stafflist = () => {
    const { staff } = useContext(StaffContext)

    console.log(staff)

    return (
        <table className='StaffList'>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Title</th>
                    <th>Join Date</th>
                    <th>Is Admin</th>
                </tr>
            </thead>
            <tbody>
                {staff.map(item => {
                    return (
                        <tr>
                            <td>{item.username}</td>
                            <td>{item.first_name} {item.last_name}</td>
                            <td>{item.email}</td>
                            <td>{item.staff_title}</td>
                            <td>{new Date(item.date_joined).toLocaleString()} </td>
                            <td>{item.is_superuser ? 'yes': 'no'}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
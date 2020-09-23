import React, { createRef, useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { StaffContext } from '../context/StaffContext'
import { ConfirmModel } from './ConfirmModel'
import { LoadingModel } from './LoadingModel'
import { StaffFormModel } from './StaffFormModel'

export const StaffTableItem = ({data}) => {
    const { user } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    const { removeFromStaff, editStaff } = useContext(StaffContext)

    const [dropdownOpen, setDropdownState] = useState(false)
    const dropMenuRef = createRef()

    const confirmRemoveStaff = () => {
        const warnText = `By removing a staff member all article published by that user will be deleted.
        Do you really want to do this ?`

        const callback = async () => {
            openModel(<LoadingModel />, false)
            await removeFromStaff(data.id)
            closeModel()
        }

        openModel(<ConfirmModel callback={callback} text={warnText} />, true)
    }

    const editStaffModel = () => {
        const callback = async (modified) => {
            openModel(<LoadingModel />, false)
            const [isSuccess, errorText] = await editStaff(data.id, modified)
            if(isSuccess) {
                closeModel()
            } else {
                openModel(<StaffFormModel data={data} callback={callback} initError={errorText} />, true)
            }
        }

        openModel(<StaffFormModel data={data} callback={callback} />, true)
    }

    const documentClicked = useCallback((e) => {
        if(!dropdownOpen) return
        const dropMenu = dropMenuRef.current
        let target = e.target
        
        do {
            if (target == dropMenu) return
            target = target.parentNode;
        } while (target)

        setDropdownState(false)
    }, [dropMenuRef, dropdownOpen, setDropdownState])

    useEffect(() => {
        document.addEventListener('click', documentClicked)
        return () => document.removeEventListener('click', documentClicked)
    }, [documentClicked])

    if(!data) {
        return <></>
    }

    return (
        <tr className='StaffTableItem'>
            <td>@{data.username}</td>
            <td>{data.first_name} {data.last_name}</td>
            <td>{data.email}</td>
            <td className='upper'>{data.staff_title}</td>
            <td className='upper'>{data.is_superuser ? 'yes': 'no'}</td>
            <td>{new Date(data.date_joined).toLocaleDateString()} </td>
            <td className='dropdown'>
                <button onClick={() => setDropdownState(!dropdownOpen)} className='options-btn'>
                    <i className="fas fa-ellipsis-v"></i>                
                </button>

                <div ref={dropMenuRef} className={`menu${dropdownOpen ? ' opened': ''}`} onBlur={() => setDropdownState(false)}>
                    <Link className='item' to={`/authors/${data.id}`}>
                        <i className="far fa-eye"></i>
                        <p>Preview</p>
                    </Link>

                    <button onClick={editStaffModel} className='item'>
                        <i className="fas fa-pen"></i>
                        <p>Modifie</p>
                    </button> 

                    {user.id !== data.id ? (
                        <button onClick={confirmRemoveStaff} className='item' to='#'>
                            <i className="fas fa-door-open"></i>
                            <p>Kick out</p>
                        </button>
                    ) : null}
                </div>
            </td>
        </tr>
    )
}
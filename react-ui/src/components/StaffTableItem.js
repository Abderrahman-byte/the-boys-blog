import React, { createRef, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const StaffTableItem = ({data}) => {
    const [dropdownOpen, setDropdownState] = useState(false)
    const dropMenuRef = createRef()

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
            <td>{new Date(data.date_joined).toLocaleString()} </td>
            <td className='dropdown'>
                <button onClick={() => setDropdownState(!dropdownOpen)} className='options-btn'>
                    <i className="fas fa-ellipsis-v"></i>                
                </button>

                <div ref={dropMenuRef} className={`menu${dropdownOpen ? ' opened': ''}`} onBlur={() => setDropdownState(false)}>
                    <Link className='item' to='#'>
                        <i className="far fa-eye"></i>
                        <p>Preview</p>
                    </Link>
                    <button className='item'>
                        <i className="far fa-eye"></i>
                        <p>Preview</p>
                    </button> 
                    <Link className='item' to='#'>
                        <i className="far fa-eye"></i>
                        <p>Preview</p>
                    </Link>
                    <Link className='item' to='#'>
                        <i className="far fa-eye"></i>
                        <p>Preview</p>
                    </Link>    
                </div>
            </td>
        </tr>
    )
}
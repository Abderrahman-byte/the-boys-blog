import React, { useState, useRef, useEffect, useContext } from 'react'

import { AuthContext } from '../context/AuthContext'

export const EditName = ({profil}) => {
    const { token, setUser } = useContext(AuthContext)
    const [name, setName] = useState(`${profil.first_name} ${profil.last_name}`)
    const [nameInputValue, setNameInputValue] = useState(`${profil.first_name} ${profil.last_name}`)
    const [editable, setEditable] = useState(false)
    const [inputError, setInputError] = useState(false)
    const nameInput = useRef(null)

    const save = async (first, last) => {
        if(`${first} ${last}` === `${profil.first_name} ${profil.last_name}`) {
            return true
        }

        const payload = JSON.stringify({'first_name':first, 'last_name':last})
        const req = await fetch('http://localhost:8000/api/user/', {
            method: 'PUT',
            body: payload,
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Token ${token}`
            }
        })
        const data = await req.json()
        setUser(data)
        return req.status >= 200 && req.status < 300
    }

    const toggleEditable = () => {
        setEditable(!editable)
    }

    const saveName = async () => {
        const nameParts = nameInputValue.split(' ')
        const first = nameParts[0]
        const last = nameParts[nameParts.length - 1]

        if(nameInputValue === '') {
            setInputError(true)
            return
        }

        if(nameParts.length < 2) {
            setInputError(true)
            return
        } 

        if(first === '' || last === '') {
            setInputError(true)
            return
        }

        const currentName = `${first} ${last}`
        const nameIsSaved = await save(first, last)

        if(nameIsSaved) {
            setInputError(false)
            setName(currentName)
            toggleEditable()
        }
    }

    useEffect(() => {
        if(editable) {
            nameInput.current.focus()
            nameInput.current.select()
        } else {
            setInputError(false)
        }
    }, [editable])

    return (
        <div className='EditName'>
            <h3 className={editable ? 'name hidden': 'name'}>{name}</h3>
            <input onInput={() => setInputError(false)} onBlur={saveName} onChange={e => setNameInputValue(e.target.value)} ref={nameInput} className={`name-input ${!editable?'hidden': ''} ${inputError?'error':''}`} type='text' value={nameInputValue} placeholder='Full name' />
            <button onClick={toggleEditable} className={editable? 'edit-btn hidden': 'edit-btn'}><i className="fas fa-pen"></i></button>
        </div>
    )
}
import React, { useState, useEffect, useRef, useContext } from 'react'

import { AuthContext } from '../context/AuthContext'

export const EditAbout = ({ profil }) => {
    const { setUser, token } = useContext(AuthContext)

    const [about, setAbout] = useState(profil.about.split('\n').map((t, i) => (<span key={i}>{t}</span>)))
    const [inputAboutValue, setInputAboutValue] = useState(profil.about)
    const [editable, setEditable] = useState(false)
    const [inputError, setInputError] = useState(false)
    const aboutInput = useRef(null)

    const toggleEditable = () => {
        setEditable(!editable)
    }

    const save = async () => {
        if(inputAboutValue === '') {
            setInputError(true)
            return
        }

        if(inputAboutValue === about) {
            toggleEditable()
            return
        }

        const payload = JSON.stringify({about: inputAboutValue})
        const options = {
            method: 'PUT',
            body: payload,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        }
        const req = await fetch('http://localhost:8000/api/user/', options)

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            setAbout(inputAboutValue.split('\n').map((t, i) => (<p key={i}>{t}</p>)))
            setUser(data)
            setInputError(false)
            toggleEditable()
        } else {
            setInputError(true)
        }
    }

    useEffect(() => {
        if(editable) {
            aboutInput.current.focus()
            aboutInput.current.select()
        }
    }, [editable])

    return (
        <div className='EditAbout'>
            <p className={editable? 'about hidden': 'about'}>{ about }</p>
            <button onClick={toggleEditable} className={editable? 'edit-btn hidden': 'edit-btn'}><i className="fas fa-pen"></i></button>
            <textarea onBlur={save} onChange={e => setInputAboutValue(e.target.value)} ref={aboutInput} className={editable? 'input-about': 'input-about hidden'} defaultValue={ inputAboutValue }></textarea>
        </div>
    )
}
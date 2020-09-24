import React, { useState, useRef, useEffect, useContext } from 'react'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from './LoadingModel'

export const EditAvatar = ({profil}) => {
    const { token, editAvatar } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const [avatarSrc, setAvatarSrc] = useState(`http://localhost:8000${profil.avatar}`)
    const avatarFileInput = useRef(null)

    const updateImage = async () => {
        openModel(<LoadingModel />, false)
        const file = avatarFileInput.current.files[0]
        const formData = new FormData()
        formData.append('avatar', file)
        const req = await fetch('http://localhost:8000/api/user/avatar', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Token ${token}`,
            }
        })

        try {
            const data = await req.json()
            if(data && data.avatar && data.avatar !== profil.avatar) {
                editAvatar(data.avatar)
            }
        } catch (err) {
            console.error(err)
        }
        
        setTimeout(closeModel, 1000)
    }

    useEffect(() => {
        if(avatarFileInput.current !== null && avatarFileInput.current.files.length > 0) {
            updateImage()
        }
    }, [avatarSrc])

    const changeImage = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener('loadend', () => {
            const data = reader.result
            setAvatarSrc(data)
        })
        reader.readAsDataURL(file)
    }

    return (
        <label htmlFor='avatar-input' className='EditAvatar'>
            <img className='avatar' src={avatarSrc} alt={`${profil.username} avatar`} />
            <input onChange={changeImage} ref={avatarFileInput} id='avatar-input' className='hidden' type='file' except='image/*' />
            <div className='edit-btn'><i className="fas fa-edit"></i></div>
        </label>
    )
}
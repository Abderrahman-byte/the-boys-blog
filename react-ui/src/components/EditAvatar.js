import React, { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const EditAvatar = ({profil}) => {
    const { token } = useContext(AuthContext)
    const [avatarSrc, setAvatarSrc] = useState(`http://localhost:8000${profil.avatar}`)
    const avatarFileInput = useRef(null)

    const updateImage = async () => {
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

        console.log(req.status)
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
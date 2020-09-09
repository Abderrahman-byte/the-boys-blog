import React, { useState, useContext } from 'react'

import '../styles/EditCommentModel.scss'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'

export const EditCommentModel = ({initContent, id, callback}) => {
    const { user, token } = useContext(AuthContext)
    const { closeModel } = useContext(ModelsContext)
    const [content, setContent] = useState(initContent)
    const [error, setError] = useState(null)

    const addError = (text) => {
        setError(text)
        setTimeout(() => setError(null), 5000)
    }

    const saveComment = async () => {
        const text = content.trim()

        if(text === initContent) {
            closeModel()
            return
        }

        const req = await fetch(`http://localhost:8000/api/comments/${id}/`, {
            method: 'PUT',
            body : JSON.stringify({content: text}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            if(data && data.content) {
                callback(data.content)
            } else {
                addError('SomeThing went wrong, Please try later.')
            }
        } else {
            addError('SomeThing went wrong, Please try later.')
        }
    }

    const handleClick = () => {
        if(content !== '' && content.length > 10) {
            saveComment()
        } else {
            addError('Comment min length required is : 10 charachteres')
        }
    }

    return (
        <div className='EditCommentModel'>
            <button className='closer' onClick={() => closeModel()}><i className='fas fa-times'></i></button>
            <label>Edit your comment</label>
            <textarea 
                className='content' 
                placeholder='Input your comment' 
                value={content} 
                onChange={e => setContent(e.target.value)}
            ></textarea>

            {error && ( <p className='error-text'>{error} </p> )}
            
            <button className='btn btn-elt btn-primary' onClick={handleClick}>save</button>
        </div>
    )
}
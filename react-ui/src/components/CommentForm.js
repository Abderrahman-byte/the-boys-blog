import React, { useContext, useState } from 'react'

import '../styles/CommentForm.scss'

import { AuthContext } from '../context/AuthContext'
import { CommentsContext } from '../context/CommentContext'
import { useParams } from 'react-router-dom'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'

export const CommentForm = () => {
    const { id, setSkeltonState, addComment } = useContext(CommentsContext)
    const { user, token } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const [content, setContent] = useState('')
    const [focused, setFocusState] = useState(false)
    const [error, setError] = useState(null)

    const addError = (text) => {
        setError(text)
        setTimeout(() => setError(null), 500)
    }

    const setDefault = () => {
        setContent('')
        setFocusState(false)
        setError(null)
    }

    const handleSubmit = async () => {
        setSkeltonState(true)
        openModel(<LoadingModel />)

        if(!token || !user || !user.id) {
            addError('login is required to submit a comment')
            setSkeltonState(false)
            setTimeout(closeModel, 1000)
            return
        }
        
        if(!id) {
            addError('Something went wrong, Please try later !')
            setSkeltonState(false)
            setTimeout(closeModel, 1000)
            return
        }

        const req = await fetch(`http://localhost:8000/api/comments/`, {
            method: 'POST',
            body: JSON.stringify({content, article: id}),
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            addComment(data)
            setDefault()
        } else {
            addError('Something went wrong, Please try later !')
        }

        setSkeltonState(false)
        setTimeout(closeModel, 1000)
    }

    return (
        <div className='CommentForm'>
            <textarea 
                placeholder='Add new comment on this article here' 
                value={content} 
                onChange={e => setContent(e.target.value)}
                maxLength={110}
                className={`form-content ${focused ? 'focus' : ''}`}
                onFocus={() => setFocusState(true)}
                onBlur={() => content.length <= 0 ? setFocusState(false) : null }
            ></textarea>

            <span className='length'>{content.length}/110</span>

            {error ? (<p className='error-text'>{error}</p>) : null}
            
            <button 
                onClick={handleSubmit} 
                className="save btn btn-elt btn-primary" 
                disabled={content.split(' ').length < 3 && content.length < 10}
            >submit</button>
        </div>
    )
}
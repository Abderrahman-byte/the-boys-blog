import React, { useContext, useState } from 'react'

import '../styles/CommentForm.scss'

import { AuthContext } from '../context/AuthContext'
import { CommentsContext } from '../context/CommentContext'

export const CommentForm = () => {
    const { id } = useContext(CommentsContext)
    const { user } = useContext(AuthContext)

    const [content, setContent] = useState('')
    const [error, setError] = useState(null)

    const addError = (text) => {
        setError(text)
        setTimeout(() => setError(null), 500)
    }

    const handleSubmit = () => {
        console.log("Comment Form submited")
    }

    return (
        <div className='CommentForm'>
            <textarea 
                placeholder='Add new comment on this article here' 
                value={content} 
                onChange={e => setContent(e.target.value)}
                maxLength={110}
                className='form-content'
            ></textarea>

            <span className='length'>{content.length}/110</span>

            <button onClick={handleSubmit} className="save btn btn-elt btn-primary" disabled={content.split(' ').length < 3}>submit</button>
        </div>
    )
}
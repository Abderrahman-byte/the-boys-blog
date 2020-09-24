import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { ConfirmModel } from './ConfirmModel'
import { CommentsContext } from '../context/CommentContext'
import { EditCommentModel } from './EditCommentModel'

export const CommentItem = ({data}) => {
    const { user, token } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    const { deleteComment, editComment } = useContext(CommentsContext)
    const history = useHistory()

    const [articleAuthor] = useState(history.location ? (history.location.state ? history.location.state.article_author: null) : null)
    const [privileges, setPrivileges] = useState([])

    useEffect(() => {
        let prevClone = []

        if(articleAuthor && data.author.id === articleAuthor.id ) {
            prevClone = [...prevClone, 'author']
        } 
        
        if(data.author.is_superuser) {
            prevClone = [...prevClone, 'admin']
        } else if (data.author.is_staff) {
            prevClone = [...prevClone, 'staff']
        } else {
            prevClone = [...prevClone, 'member']
        }

        setPrivileges([...prevClone])
    }, [articleAuthor, data])

    const formatDate = (time) => {
        const date = new Date(time)
        const today = new Date()
        let relevent = null
        const hours = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
        const minutes = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
        
        if(today - date < 24 * 60 * 60 * 1000) relevent = 'Today'

        else if (today - date < 48 * 60 * 60 * 1000) relevent = 'Yesterday'

        return relevent ? `${relevent} at ${hours}:${minutes}` : date.toLocaleString()
    }

    const getTitle = () => {
        let privClone = [...privileges]
        
        if(privClone.indexOf('author') >= 0) {
            privClone.splice(privClone.indexOf('author'), 1)
        }

        return privClone[0]
    }

    const editItem = (content) => {
        editComment(data.id, content)
        closeModel()
    }

    const deleteItem = async () => {
        const req = await fetch(`http://localhost:8000/api/comments/${data.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            deleteComment(data.id)
        }

        closeModel()
    }

    const openDeleteWarn = () => {
        if(data.id) {
            openModel(<ConfirmModel text='Do you realy want to delete you comment' callback={deleteItem} />, true)
        } 
    }

    const openEditor = () => {
        if(data.id) {
            openModel(<EditCommentModel initContent={data.content} id={data.id} callback={editItem} />, true)
        }
    }
    
    return (
        <div className={`CommentItem ${privileges.includes('author') ? 'author' : ''}`}>
            <div className='profil'>
                <img className='avatar' src={`http://localhost:8000${data.author.avatar}`} alt={data.author.username} />
                <span>{getTitle()} </span>
            </div>

            <div className='info'>
                <p className='name'>
                    {data.author.first_name && data.author.last_name ? 
                    `${data.author.first_name} ${data.author.last_name}`: 
                    '@' + data.author.username} {privileges.includes('author') ? (<span role="img" aria-label='author-title' className='title'>⚫The Author</span>) : null}
                </p>
                <p className='posted_date'>{formatDate(data.posted_date)}</p>
                <div className='content'>{data.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
            </div>

            {user && data && user.id === data.author.id && (
                <div className='controls'>
                    <button onClick={openEditor} data-title='Edit Comment' className='edit tooltip tooltip-left'><i className='fas fa-pen'></i></button>
                    <button onClick={openDeleteWarn} data-title='Delete Comment' className='delete tooltip tooltip-top'><i className='fas fa-trash'></i></button>
                </div>
            ) } 
            
        </div>
    )
}
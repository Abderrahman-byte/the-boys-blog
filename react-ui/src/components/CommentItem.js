import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'

export const CommentItem = ({data}) => {
    const { user } = useContext(AuthContext)
    const history = useHistory()
    const [articleAuthor, setArticleAuthor] = useState(history.location.state.article_author)
    const [privileges, setPrivileges] = useState([])

    useEffect(() => {
        let prevClone = []

        if(articleAuthor && data.author.id === articleAuthor.id ) {
            console.log(data.author.id)
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
    
    return (
        <div className={`CommentItem ${privileges.includes('author') ? 'author' : ''}`}>
            <div className='profil'>
                <img className='avatar' src={`http://localhost:8000${data.author.avatar}`} />
                <span>{getTitle()} </span>
            </div>

            <div className='info'>
                <p className='name'>
                    {data.author.first_name && data.author.last_name ? 
                    `${data.author.first_name} ${data.author.last_name}`: 
                    '@' + data.author.username} {privileges.includes('author') ? (<span className='title'>⚫The Author</span>) : null}
                </p>
                <p className='posted_date'>{formatDate(data.posted_date)}</p>
                <p className='content'>{data.content}</p>
            </div>

            {user && data && user.id === data.author.id && (
            <div className='controls'>
                <button>
                    <i className='fas fa-pen'></i>
                    <i className='fas fa-trash'></i>
                </button>
            </div>) } 
            
        </div>
    )
}
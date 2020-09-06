import React from 'react'

export const CommentItem = ({data}) => {
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
    
    return (
        <div className='CommentItem'>
            <img className='avatar' src={`http://localhost:8000${data.author.avatar}`} />
            <div className='info'>
                <p className='name'>
                    {data.author.first_name && data.author.last_name ? 
                    `${data.author.first_name} ${data.author.last_name}`: 
                    '@' + data.author.username}
                </p>
                <p className='posted_date'>{formatDate(data.posted_date)}</p>
                <p className='content'>{data.content}</p>
            </div>
        </div>
    )
}
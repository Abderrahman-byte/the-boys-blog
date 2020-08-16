import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const ArticlePage = ({setWallpaper, setTitle}) => {
    const { id } = useParams()
    const [data, setData] = useState({})
    
    const getArticle = async () => {
        const req = await fetch(`http://localhost:8000/api/articles/${id}`)
        if(req.status >= 200 && req.status < 300) {
            const data = await req.json()
            setData(data)
        } else {
            console.log('Must redirect to 404')
        }
    }

    useEffect(() => {
        setWallpaper(null)
        setTitle(null)
        getArticle()
    }, [])

    useEffect(() => {
        setWallpaper(data.overview)
        setTitle(data.title)
    }, [data])

    return (
        <div>{id}</div>
    )
}
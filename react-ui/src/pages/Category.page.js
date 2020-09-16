import React from 'react'
import { useParams } from 'react-router-dom'

export const CategoryPage = ({setDefault, setHeaderText, setWallpaperImg}) => {
    const { title } = useParams()

    return (
        <div className='CategoryPage'>
            this is title {title}
        </div>
    )
}
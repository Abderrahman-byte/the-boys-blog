import React, { useState } from 'react'

import '../styles/MainPage.scss'

import { Wallpaper } from '../components/Wallpaper'

export const MainPage = () => {
    const [wallpaperImg, setWallpaperImg] = useState('http://localhost:8000/media/images/wp-1.jpg')
    const [headerText, setHeaderText] = useState('Grow fast or die slow')

    return (
        <div className='MainPage'>
            <Wallpaper src={wallpaperImg} text={headerText} />
        </div>
    )
}
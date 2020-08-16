import React, { useState } from 'react'

import '../styles/Wallpaper.scss'

export const Wallpaper = ({src, text}) => {
    const [currentImg, setCurrentImg] = useState(src)
    const [imgIsLoaded, setImgLoaded] = useState(false)

    return (
        <div className='Wallpaper'>
            <img className={imgIsLoaded ? null : 'hidden'} src={currentImg} onLoad={() => setImgLoaded(true)} />

            {imgIsLoaded ? (
                <div className='filter'>
                    <p>{ text }</p>
                </div>
            ) : (
                <div className='lds-ring big'><div></div><div></div><div></div><div></div></div>
            )}
        </div>
    )
}
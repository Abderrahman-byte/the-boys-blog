import React, { useState } from 'react'

import '../styles/Wallpaper.scss'

export const Wallpaper = ({src, text}) => {
    const [imgIsLoaded, setImgLoaded] = useState(false)

    return (
        <div className='Wallpaper'>
            <img className={imgIsLoaded ? null : 'hidden'} src={src} onLoad={() => setImgLoaded(true)} onError={() => setImgLoaded(false)} />

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
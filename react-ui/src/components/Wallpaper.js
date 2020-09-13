import React, { useState, useEffect } from 'react'

import '../styles/Wallpaper.scss'

export const Wallpaper = ({src, text}) => {
    const [imgIsLoaded, setImgLoaded] = useState(false)
    const [url, setUrl] = useState(src)

    useEffect(() => {
        if(src !== url) {
            setUrl(src)
        }
    }, [src])

    return (
        <div className='Wallpaper'>
            <img 
                className={imgIsLoaded ? null : 'hidden'} 
                src={url} 
                onLoad={() => setImgLoaded(true)} 
                onError={() => {
                    setImgLoaded(false)
                    setUrl('http://localhost:8000/media/images/placeholder.jpg')
                }}
            />

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
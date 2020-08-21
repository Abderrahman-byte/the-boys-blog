import React from 'react'

export const Embed = ({data}) => {
    if(!data || !data.embed ) {
        return null
    }
    
    return (
        <iframe className='Embed' height={data.height} frameBorder='0' allowFullScreen src={data.embed}></iframe>
    )
}
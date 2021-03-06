import React from 'react'

export const Embed = ({data}) => {
    if(!data || !data.embed ) {
        return <></>
    }

    return (
        <iframe className='Embed' title={data.service || 'Embed element'} height={data.height} frameBorder='0' allowFullScreen src={data.embed}></iframe>
    )
}
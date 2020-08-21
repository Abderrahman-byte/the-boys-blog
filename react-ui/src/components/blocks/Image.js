import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const BlockImage = ({data}) => {
    if(!data | !data.file || !data.file.url ) {
        return null
    }


    return (
        <figure className='Image'>
            <img src={data.file.url} className={`${data.withBorder? 'border': ''}`} alt={data.caption || ''} />
            {data.caption && <figcaption>{AllHtmlEntities.decode(data.caption)}</figcaption>}
        </figure>
    )
}
import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const SimpleImage = ({data}) => {
    if(!data || !data.url) {
        return null
    }

    return (
        <figure className='Image'>
            <div className={`container ${data.withBorder? 'border': ''} ${data.withBackground? 'withBackground': ''} ${data.stretched? 'stretched': ''}`}>     
                <img src={data.url} alt={data.caption || ''} />
            </div>
            {data.caption && <figcaption>{AllHtmlEntities.decode(data.caption)}</figcaption>}
        </figure>
    )
}
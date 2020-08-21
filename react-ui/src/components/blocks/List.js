import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const BlockList = ({data}) => {
    if(!data || !data.items || data.items.length < 0) {
        return null
    }

    
    return (
        <ul className={`List`}>
            {data.items.map((item, i) => <li key={i}>{AllHtmlEntities.decode(item)}</li>)}
        </ul>
    )
}
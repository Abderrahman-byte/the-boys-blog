import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const Paragraph = ({data}) => {
    return (
        <p className='Paragraph'>{AllHtmlEntities.decode(data.text || '')}</p>
    )
}
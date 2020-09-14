import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const Paragraph = ({data}) => {
    return (
        <p className='Paragraph' dangerouslySetInnerHTML={{ __html: AllHtmlEntities.decode(data.text || '')}} />
    )
}
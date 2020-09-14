import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const Header = ({data}) => {
    if(!data || !data.level) {
        return null
    }

    const text = AllHtmlEntities.decode(data.text)

    switch (data.level) {
        case 1 :
            return (<h1 className='BlockHeader' dangerouslySetInnerHTML={{ __html: text}} />)
        case 2 :
            return (<h2 className='BlockHeader' dangerouslySetInnerHTML={{ __html: text}} />)
        case 3 :
            return (<h3 className='BlockHeader' dangerouslySetInnerHTML={{ __html: text}} />)
        case 4 :
            return (<h4 className='BlockHeader' dangerouslySetInnerHTML={{ __html: text}} />)
        case 5 :
            return (<h5 className='BlockHeader' dangerouslySetInnerHTML={{ __html: text}} />)
        case 6 :
            return (<h6 className='BlockHeader' dangerouslySetInnerHTML={{ __html: text}} />)
    }
    
}
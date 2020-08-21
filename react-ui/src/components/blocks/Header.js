import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const Header = ({data}) => {
    if(!data || !data.level) {
        return null
    }

    switch (data.level) {
        case 1 :
            return (<h1 className='BlockHeader'>{AllHtmlEntities.decode(data.text)}</h1>)
        case 2 :
            return (<h2 className='BlockHeader'>{AllHtmlEntities.decode(data.text)}</h2>)
        case 3 :
            return (<h3 className='BlockHeader'>{AllHtmlEntities.decode(data.text)}</h3>)
        case 4 :
            return (<h4 className='BlockHeader'>{AllHtmlEntities.decode(data.text)}</h4>)
        case 5 :
            return (<h5 className='BlockHeader'>{AllHtmlEntities.decode(data.text)}</h5>)
        case 6 :
            return (<h6 className='BlockHeader'>{AllHtmlEntities.decode(data.text)}</h6>)
    }
    
}
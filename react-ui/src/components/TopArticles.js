import React, { useEffect, useState } from 'react'

import { AsideList } from './AsideList'

export const TopArticles = ({sortby, title}) => {
    const [data, setData] = useState([])
    const [serializedData, serializeData] = useState([])
    const [isLoading, setLoadingState] = useState(true)

    const getArticles = async () => {
        setLoadingState(true)
        const sorts_available = ['posted_date', 'views', 'updated_date']
        const sort = sorts_available.includes(sortby) ? sortby : sorts_available[0]
        const req = await fetch(`http://localhost:8000/api/articles/?sort=${sort}&limit=3`)

        if(req.status >= 200 && req.status < 300) {
            const results = await req.json()
            setData(results)
        } else {
            // console.error(await req.json())
        }

        setLoadingState(false)
    }

    const getImage = (article) => {
        const placeholder = 'http://localhost:8000/media/images/placeholder.jpg'
        let content = null
        try { content = JSON.parse(article.content).blocks}
        catch(err) {content = null}

        if(!content) return placeholder

        const imageBlocks = content.filter(block => block.type === 'simpleImage' || block.type === 'image')
        const imageObj = imageBlocks[0] || null

        if(imageObj && imageObj.data && imageObj.type) {
            let url = ''
            switch(imageObj.type) {
                case 'image':
                    url = imageObj.data.file.url
                    break
                case 'simpleImage' :
                    url = imageObj.data.url
                    break
                default :
                    url = article.overview || placeholder
            }

            return {url, 'caption': imageObj.data.caption}
        } 
        else if(article.overview) return {'url': article.overview, 'caption': article.title}
        else return {'url': placeholder, 'caption': article.title}
    }

    const escape = (text) => {
        const span = document.createElement('span')
        span.innerHTML = text
        return span.innerText || span.textContent
    }

    const getDescription = (article) => {
        let content = null
        try { content = JSON.parse(article.content).blocks}
        catch(err) {content = null}

        if(!content || content.length <= 0) return null

        const paragraph = content.filter(block => block.type === 'paragraph')[0]
        if(!paragraph || !paragraph.data || !paragraph.data.text) return null

        const text = escape(paragraph.data.text)
        return text.slice(0, '100') + '...'
    }

    const getSlug = (text) =>  {
        return encodeURIComponent(text.replace(/\s/g,'-'))
    }

    useEffect(() => {
        if(!data || data.length <= 0) return
        
        setLoadingState(true)
        const serialized = data.map(article => {
            return {
                'title': article.title,
                'image': getImage(article),
                'description': getDescription(article),
                'url': `/articles/${getSlug(article.title)}`
            }
        })

        serializeData(serialized)
        setLoadingState(false)
    }, [data])

    useEffect(() => {
        getArticles()
    }, [])

    return <AsideList data={serializedData} isLoading={isLoading} title={title || 'title is not provided'} />
}
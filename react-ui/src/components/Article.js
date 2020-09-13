import React from 'react'

import '../styles/Article.scss'

import { Paragraph } from './blocks/Paragraph'
import { Header } from './blocks/Header'
import { BlockImage } from './blocks/Image'
import { Embed } from './blocks/Embed'
import { BlockList } from './blocks/List'
import { Checklist } from './blocks/Checklist'
import { SimpleImage } from './blocks/SimpleImage'

const dataToComponent = (block) => {
    if (!block || !block.data || !block.type) {
        return null
    }

    switch (block.type) {
        case 'embed':
            return (<Embed data={block.data} />)
        case 'table':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'paragraph':
            return (<Paragraph data={block.data} />)
        case 'list':
            return (<BlockList data={block.data} />)
        case 'warning':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'code':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'linkTool':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'simpleImage':
            return (<SimpleImage data={block.data} />)
        case 'image':
            return (<BlockImage data={block.data} />)
        case 'raw':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'header':
            return (<Header data={block.data} />)
        case 'quote':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'marker':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'checklist':
            return (<Checklist data={block.data} />)
        case 'delimiter':
            return (<div className='delimiter'></div>)
        case 'inlineCode':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
    }
}

export const Article = ({ blocks }) => {
    const children = blocks.map((block, i) => <div key={i} className='block__content'>{dataToComponent(block)}</div>)
    return (
        <div className='Article'>
            {children}
        </div>
    )
}
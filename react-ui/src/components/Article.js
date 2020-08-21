import React from 'react'

import '../styles/Article.scss'

import { Paragraph } from './blocks/Paragraph'
import { Header } from './blocks/Header'
import { BlockImage } from './blocks/Image'
import { Embed } from './blocks/Embed'
import { BlockList } from './blocks/List'

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
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'image':
            return (<BlockImage data={block.data} />)
        case 'raw':
            return (<p>Type {block.type} is not supported yet</p>)
        case 'header':
            return (<Header data={block.data} />)
        case 'quote':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'marker':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'checklist':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'delimiter':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
        case 'inlineCode':
            return (<p className='warning'>Type {block.type} is not supported yet</p>)
    }
}

export const Article = ({ blocks }) => {
    const children = blocks.map(block => <div className='block__content'>{dataToComponent(block)}</div>)
    return (
        <div className='Article'>
            {children}
        </div>
    )
}
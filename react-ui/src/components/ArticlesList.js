import React from 'react'

import '../styles/ArticlesList.scss'

import { ArticleCard } from './ArticleCard'
import { ArticleSkel } from './ArticleSkel'

export const ArticlesList = ({data, isLoading, itemsPerPage, count, removeItem}) => {

    const getSkeletons = () => {
        if(itemsPerPage && count && typeof(itemsPerPage) === 'number' && typeof(count) === 'number') {
            const ipp = itemsPerPage || 5
            const left = count - data.length
            if(left <= 0) return null
            const holders = Array(ipp > left ? left : ipp).fill(0)
            return holders.map((v, i) => <ArticleSkel key={i} />)
        } else {
            return Array(itemsPerPage || 5).fill(0).map((v, i) => <ArticleSkel key={i} />)
        }
    }

    return (
        <div className='ArticlesList'>
            {data.map(article => <ArticleCard key={article.id} data={article} deleteItem={removeItem || null} />)}
            {isLoading ? getSkeletons() : null}
        </div>
    )
}
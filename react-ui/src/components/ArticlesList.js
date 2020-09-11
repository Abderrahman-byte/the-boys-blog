import React from 'react'

import '../styles/ArticlesList.scss'

import { ArticleCard } from './ArticleCard'

export const ArticlesList = ({data, isLoading, itemsPerPage}) => {
    return (
        <div className='ArticlesList'>
            {data.map(article => <ArticleCard key={article.id} data={article} />)}
        </div>
    )
}
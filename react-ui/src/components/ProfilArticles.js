import React, { useState, useEffect } from 'react'

export const ProfilArticles = ({profil}) => {
    const [data, setData] = useState([])
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(5)

    const [isMore, setMoreState] = useState(true)
    const [isLoading, setLoadingState] = useState(false)

    const getArticles = () => {
        console.log(`we need to get ${itemsPerPage} articles for page ${currentPage} in ${profil.id} profil`)
    }

    useEffect(() => {
        getArticles()
    }, [currentPage])
    
    return (
        <div className='ProfilArticle'>
                    
        </div>
    )
}
import React, { useEffect, useState } from 'react'

export const BestArticles = () => {
    const [data, setData] = useState([])
    const [isLoading, setLoadingState] = useState()

    const getArticles = async () => {
        console.log('fixed in the server side')
    } 

    useEffect(() => {
        getArticles()
    }, [])

    return (
        <div>
            someeeeeeeeeeeeeeeee bull sghiot
        </div>
    )
}
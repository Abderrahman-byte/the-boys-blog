import React, { useContext, createContext, useState, useEffect } from 'react'

export const CommentsContext = createContext({})

export const CommentsProvider = ({id, count, children}) => {
    const [data, setData] = useState([])
    const [dataCount, setDataCount] = useState(count)

    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(5)
    
    const [isMore, setMoreState] = useState(true)
    const [isLoading, setLoadingState] = useState(false)
    const [skelton, setSkeltonState] = useState(true)

    const getComments = async () => {
        setLoadingState(true)
        const offset = (itemsPerPage * currentPage) - itemsPerPage
        const url = `http://localhost:8000/api/comments/?id=${id}&limit=${itemsPerPage}&offset=${offset}`
        const req = await fetch(url)

        if(req.status >= 200 && req.status < 300) {
            let response = null

            try { response = await req.json() }
            catch(err) { response = null }

            if(!response || response.length < itemsPerPage) {
                setMoreState(false)
                if(!response) return
            }

            if(data.length + response.length >= dataCount) setMoreState(false)

            setData([...data, ...response])
        } else {
            setMoreState(false)
        }

        setLoadingState(false)
    }

    const nextComments = () => {
        setPage(currentPage + 1)
    }

    const editComment = (id, content) => {
        const oldData = data.find(item => item.id === id)
        const newData = {...oldData, content}
        setData(data.map(item => item.id === id ? newData : item))
    }

    const deleteComment = (id) => {
        setData(data.filter(item => item.id !== id))
        setDataCount(dataCount - 1)
    }

    useEffect(() => {
        getComments()
    }, [currentPage])


    return (
        <CommentsContext.Provider value={{
            id, 
            data, 
            dataCount, 
            isMore, 
            isLoading,  
            skelton, 
            setMoreState, 
            nextComments, 
            editComment, 
            deleteComment,
            setSkeltonState
        }}>
            {children}
        </CommentsContext.Provider>
    )
}
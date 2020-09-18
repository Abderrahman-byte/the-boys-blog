import React, { useContext, useEffect, useState } from 'react'
import { TeamList } from '../components/TeamList'
import { ModelsContext } from '../context/ModelsContext'

export const TeamPage = ({setDefault, setWallpaperImg, setHeaderText}) => {
    const { openModel, closeModel } = useContext(ModelsContext)
    const [data, setData] = useState([])
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(2)

    const [isMore, setMoreState] = useState(true)
    const [isLoading, setLoadingState] = useState(true)

    const getStaff = async () => {
        if(!isMore) return

        setLoadingState(true)
        const offset = itemsPerPage * (currentPage - 1)
        const req = await fetch(`http://localhost:8000/api/staff?limit=${itemsPerPage}&offset=${offset}`)
        
        if(req.status >= 200 && req.status < 300) {
            const results = await req.json()
            
            if(results.length < itemsPerPage) setMoreState(false)

            setData([...data, ...results])
        } else {
            console.log(await req.json())
        }
        setLoadingState(false)
        closeModel()
    }

    const nextPage = () => {
        setPage(currentPage + 1)
    }

    useEffect(() => {
        getStaff()
    }, [currentPage])

    useEffect(() => {
        setHeaderText('Our Team')
        setWallpaperImg('http://localhost:8000/media/images/team.jpg')

    }, [])

    return (
        <div className='TeamPage'>
            <div className='row'>
                <div className='content'>
                    <TeamList
                        data={data}
                    />
                    {isMore && !isLoading ? (
                        <button 
                        onClick={nextPage} 
                        style={{ margin: '0 auto', padding: '.5em 1.75em', display: 'block'}} 
                        className='btn btn-elt btn-primary'>More</button>
                    ): null}
                    </div>
                <div className='aside'></div>
            </div>
        </div>
    )
}
import React, { useContext, useEffect, useState } from 'react'

import { TeamList } from '../components/TeamList'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'

export const TeamPage = ({setDefault, setWallpaperImg, setHeaderText}) => {
    const { openModel, closeModel } = useContext(ModelsContext)
    const [data, setData] = useState([])
    const [dataCount, setDataCount] = useState(0)
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(10)

    const [isMore, setMoreState] = useState(true)
    const [isLoading, setLoadingState] = useState(true)

    const getStaff = async () => {
        if(!isMore) return
        openModel(<LoadingModel />, false)
        setLoadingState(true)
        const offset = itemsPerPage * (currentPage - 1)
        const req = await fetch(`http://localhost:8000/api/staff?limit=${itemsPerPage}&offset=${offset}`)
        
        if(req.status >= 200 && req.status < 300) {
            const results = await req.json()
            const resData = results.data
            const resCount = results.count

            if(resData.length < itemsPerPage || resData.length + data.length >= resCount) setMoreState(false)

            setDataCount(resCount)
            setData([...data, ...resData])
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
                        count={dataCount}
                        isLoading={isLoading}
                        itemsPerPage={itemsPerPage}
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
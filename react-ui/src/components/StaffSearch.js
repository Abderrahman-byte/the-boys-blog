import React, { useEffect, useState } from 'react'

import { TeamList } from './TeamList'

export const StaffSearch = ({ initData, count, query }) => {
    const [data, setData] = useState(() => [...initData])
    const [currentPage, setPage] = useState(1)
    const [itemsPerPage] = useState(3)

    const [isMore, setMoreState] = useState(() => initData && initData.length < count)
    const [isLoading, setLoadingState] = useState(false)

    const getStaffData = async () => {
        if(!isMore) return
        setLoadingState(true)
        const params = `query=${query}&type=staff&limit=${itemsPerPage}&offset=${(currentPage  - 1) * itemsPerPage}`
        const req = await fetch(`http://localhost:8000/api/search?${params}`)

        if(req.status >= 200 && req.status < 300) {
            const response = await req.json()
            if(response.staff && response.staff.data) {
                setData([...data, ...response.staff.data])
                if(response.staff.data.length < itemsPerPage || response.staff.data.length + data.length >= count) setMoreState(false)
            } else {
                setMoreState(false)
            }
        } else {
            setMoreState(false)
            console.log(await req.json())
        }

        setLoadingState(false)
    }

    const nextPage = () => {
        setPage(currentPage + 1)
    }

    useEffect(() => {
        setMoreState(() => initData && initData.length < count)
    }, [initData, count])

    useEffect(() => {
        if(currentPage > 1) {
            getStaffData()
        }

    }, [currentPage])

    return (
        <div className='StaffSearch'>
            <h3 className='section-header'>Authors :</h3>

            <TeamList 
                data={data}
                isLoading={isLoading}
                itemsPerPage={itemsPerPage}
                count={count}
            />

            {isMore && !isLoading ? (
                <button onClick={nextPage} className='btn btn-primary btn-elt more-btn'>More</button>
            ) : null}
        </div>
    )
}
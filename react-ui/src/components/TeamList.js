import React from 'react'

import '../styles/TeamList.scss'

import { StaffCard } from './StaffCard'
import { StaffSkel } from './StaffSkel'

export const TeamList = ({data, isLoading, itemsPerPage, count}) => {

    const getSkeletons = () => {
        if(itemsPerPage && count && typeof(itemsPerPage) === 'number' && typeof(count) === 'number') {
            const ipp = itemsPerPage || 5
            const left = count - data.length
            if(left <= 0) return null
            const holders = Array(ipp > left ? left : ipp).fill(0)
            return holders.map((v, i) => <StaffSkel key={i} />)
        } else {
            return Array(itemsPerPage || 5).fill(0).map((v, i) => <StaffSkel key={i} />)
        }
    }

    return (
        <div className='TeamList'>
            {data.map(item => <StaffCard key={item.id} data={item} />)}
            {isLoading ? getSkeletons() : null}
        </div>
    )
}
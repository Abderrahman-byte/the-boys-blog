import React from 'react'

import '../styles/TeamList.scss'

import { StaffCard } from './StaffCard'

export const TeamList = ({data}) => {
    return (
        <div className='TeamList'>
            {data.map(item => <StaffCard key={item.id} data={item} />)}
        </div>
    )
}
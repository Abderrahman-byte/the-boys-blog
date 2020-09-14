import React from 'react'

export const Code = ({data}) => {
    if(!data || !data.code) return null
    
    return (
        <pre className='Pre-Code'>
            <code className='Code'>{data.code}</code>
        </pre>
    )
}
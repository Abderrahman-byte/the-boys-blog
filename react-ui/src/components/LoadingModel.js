import React from 'react'

import '../styles/LoadingModel.scss'

export const LoadingModel = ({text}) => {
    return (
        <div className='LoadingModel'>
            <div className='lds-ring center'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <p>{text || 'Syncing your data ...'}</p>
        </div>
    )
}
import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/AsideList.scss'

export const AsideList = ({data, isLoading, title}) => {
    if(isLoading) {
        return (
            <div className='AsideList loading'>
                <div className='lds-ring'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    } else if(data && data.length > 0) {
        return (
            <div className='AsideList'>
                <h6 className='title'>{title}</h6>

                <div className='list'>
                    {data.map((item,i) => {
                        return (
                            <Link key={i} to={item.url} className='item'>
                                <img className='overview' src={item.image.url} alt={item.image.caption} />
                                <div className='body'>
                                    <h6 className='title'>{item.title}</h6>
                                    {item.subtitle ? <p className='subtitle'>{item.subtitle} </p> : null}
                                    {item.description ? <p className='desc'>{item.description}</p>: null}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    } else {
        return <></>
    }
}
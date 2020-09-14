import React from 'react'

export const Quote = ({ data }) => {
    if(!data || !data.text) return null

    console.log(data)
    return (
        <div className='Quote'>
            <blockquote dangerouslySetInnerHTML={{ __html: data.text}} />
            <footer className={`caption caption-${data.alignment}`}>{data.caption}</footer>
        </div>
    )
}
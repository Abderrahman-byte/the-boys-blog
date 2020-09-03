import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const Checklist = ({data}) => {
    if(!data || !data.items) {
        return null
    } 

    return (
        <div className="Checklist">
            {data.items.map((item, i) => (
                <div key={i} className="checklist-item">
                    <span className={`button ${item.checked?'checked':''}`}></span>
                    <p className="text">{item.text} </p>
                </div>
            ))}
        </div>
    )
}
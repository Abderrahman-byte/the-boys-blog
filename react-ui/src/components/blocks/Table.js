import React from 'react'
import { AllHtmlEntities } from 'html-entities'

export const Table = ({data}) => {
    if(!data || !data.content) {
        return null
    }

    const getTableElements = () => {
        return data.content.map((row, i) => {
            if(!(row instanceof Array)) return null

            return (<tr key={i}>
                {row.map((text, i) => <td key={i}>{AllHtmlEntities.decode(text)}</td>)}
            </tr>)
        })
    }

    return (
        <div className='Table'>
            <table>
                <tbody>
                    {getTableElements()}
                </tbody>
            </table>
            
        </div>
    )
} 
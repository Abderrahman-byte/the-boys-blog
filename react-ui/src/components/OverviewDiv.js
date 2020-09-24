import React, { useState, useEffect, useContext } from 'react'

import '../styles/OverviewDiv.scss'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel} from './LoadingModel'

export const OverviewDiv = ({init, setGlobal}) => {
    const { token } = useContext(AuthContext)
    const { openModel, closeModel} = useContext(ModelsContext)
    const [overviewUrl, setOverviewUrl] = useState(init)
    const [imgIsLoading, setImagLoading] = useState()

    const deleteOverview = async () => {
        if(overviewUrl) {
            const payload = JSON.stringify({ file: { url : overviewUrl }})
            const options = { method: 'DELETE', body: payload, headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'}}
            const req = await fetch('http://localhost:8000/api/articles/images', options)

            if(req.status >= 200 && req.status < 300) {
                setOverviewUrl(null)
                setGlobal(null)
            } else {
                const data = await req.text()
                // console.error(data)
            }
        }
    }

    const changeOverview = async e => {
        const file = e.target.files[0]

        if(file) {
            openModel(<LoadingModel />, false)
            setImagLoading(true)
            const formData = new FormData()
            formData.append('image', file)
            const options = { method: 'POST', body: formData, headers: {'Authorization': `Token ${token}`}}
            const req = await fetch('http://localhost:8000/api/articles/images', options)
            if(req.status >= 200 && req.status < 300) {
                const data = await req.json()
                setOverviewUrl(data.file.url)
                if(setGlobal) setGlobal(data.file.url)
            } else {
                const data = await req.text()
                // console.error(data)
            }
            setTimeout(closeModel, 1000)
        }

    }

    useEffect(() => {
        if(init !== overviewUrl) {
            setOverviewUrl(init)
        }
    }, [init])

    return (
        <div className='overview-div'>
            {imgIsLoading && (
                <div className="lds-ring center">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}

            {overviewUrl ? (
                <>
                    <img 
                        onLoad={() => setImagLoading(false)} 
                        onError={() => {
                            setOverviewUrl(null)
                            setGlobal(null)
                        }}
                        src={overviewUrl} 
                        className={imgIsLoading ? 'hidden': ''} 
                    />
                    <button onClick={deleteOverview} className={`delete-image ${imgIsLoading ? 'hidden': ''}`}><i className="fas fa-trash-alt"></i></button>
                </>
            ) : (
                <label className={`upload ${imgIsLoading ? 'hidden': ''}`}>
                    <input onChange={changeOverview} type='file' className='hidden' />
                    <i className="fas fa-download"></i>
                    <p>Add Article Overview Image</p>
                </label>
            )}
        </div>
    )
}
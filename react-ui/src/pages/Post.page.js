import React, { useState, useEffect, useContext } from 'react'
import EditorJs from 'react-editor-js'

import '../styles/PostPage.scss'

import { EDITOR_JS_TOOLS } from '../components/editorTools'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Link, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const PostPage = ({ create, article }) => {
    const { token } = useContext(AuthContext)

    const [editorContent, setEditorContent] = useLocalStorage('new-post-content', {"time":1597330033064,"blocks":[{"type":"header","data":{"text":"Lorem Ipsum","level":2}},{"type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}}],"version":"2.18.0"})
    const [articleTitle, setArticleTitle] = useState('')
    const [overviewUrl, setOverviewUrl] = useState(null)
    const [imgIsLoading, setImagLoading] = useState(false)

    const [isNew, setIsNew] = useState(create ? true : false)
    const [articleId, setArticleId] = useState(article || null)

    const changeEditor = (e, data) => {
        if(data.blocks && data.blocks.length > 0) setEditorContent(data)
        else setEditorContent(null)
    }

    const changeOverview = async e => {
        const file = e.target.files[0]

        if(file) {
            setImagLoading(true)
            const formData = new FormData()
            formData.append('image', file)
            const options = { method: 'POST', body: formData, headers: {'Authorization': `Token ${token}`}}
            const req = await fetch('http://localhost:8000/api/articles/images', options)
            if(req.status >= 200 && req.status < 300) {
                const data = await req.json()
                setOverviewUrl(data.file.url)
                console.log(data)
            } else {
                console.error('Must set errors')
            }
        }

    }

    const deleteOverview = async () => {
        if(overviewUrl) {
            const payload = JSON.stringify({ file: { url : overviewUrl }})
            const options = { method: 'DELETE', body: payload, headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'}}
            const req = await fetch('http://localhost:8000/api/articles/images', options)

            if(req.status >= 200 && req.status < 300) {
                setOverviewUrl(null)
            }
        }
    }

    useEffect(() => {
        console.log(isNew)
    })

    return (
        <div className='PostPage'>
            <h1>{create ? 'Post New Article': 'Update Article'}</h1>

            <input className='title-input' onChange={e => setArticleTitle(e.target.value)} type='text' value={articleTitle} placeholder='Article Title' />

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
                        <img onLoad={() => setImagLoading(false)} src={overviewUrl} className={imgIsLoading ? 'hidden': ''} />
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

            <div className='editor'>
                <EditorJs data={editorContent} onChange={changeEditor} tools={EDITOR_JS_TOOLS} />
            </div>

            <div className='btns-div'>
                <button className='btn btn-primary btn-elt'>save</button>
                <button disabled className='btn btn-primary btn-elt'>preview</button>
            </div>
        </div>
    )
}
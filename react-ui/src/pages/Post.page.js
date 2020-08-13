import React, { useState, useEffect } from 'react'
import EditorJs from 'react-editor-js'

import '../styles/PostPage.scss'

import { EDITOR_JS_TOOLS } from '../components/editorTools'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Link, Redirect } from 'react-router-dom'

export const PostPage = ({ create, article }) => {
    const [editorContent, setEditorContent] = useLocalStorage('new-post-content', {"time":1597330033064,"blocks":[{"type":"header","data":{"text":"Lorem Ipsum","level":2}},{"type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}}],"version":"2.18.0"})
    const [articleTitle, setArticleTitle] = useState('')
    const [overviewUrl, setOverviewUrl] = useState(null)

    const [isNew, setIsNew] = useState(create ? true : false)
    const [articleId, setArticleId] = useState(article || null)

    const changeEditor = (e, data) => {
        if(data.blocks && data.blocks.length > 0) setEditorContent(data)
        else setEditorContent(null)
    }

    const changeOverview = e => {
        const file = e.target.files[0]

        if(file) {
            const reader = new FileReader()
            reader.addEventListener('loadend', () => {
                const data = reader.result
                setOverviewUrl(data)
            })
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        console.log(isNew)
    })

    return (
        <div className='PostPage'>
            <h1>Post New Article</h1>

            <input className='title-input' onChange={e => setArticleTitle(e.target.value)} type='text' value={articleTitle} placeholder='Article Title' />

            <div className='overview-div'>
                {overviewUrl ? (
                    <>
                        <img src={overviewUrl} />
                        <button onClick={() => setOverviewUrl(null)} className='delete-image'><i class="fas fa-trash-alt"></i></button>
                    </>
                ) : (
                    <label className='upload'>
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
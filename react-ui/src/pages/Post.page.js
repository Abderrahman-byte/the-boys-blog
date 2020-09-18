import React, { useState, useEffect, useContext, createRef } from 'react'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom'
import EditorJs from 'react-editor-js'

import '../styles/PostPage.scss'

import { EDITOR_JS_TOOLS } from '../components/editorTools'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'
import { OverviewDiv } from '../components/OverviewDiv'
import { CategoriesProvider } from '../context/CategoriesContext'
import { ArticleCategories } from '../components/ArticleCategories'

export const PostPage = ({ create, article }) => {
    const { token, user } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    const params = useParams()
    const history = useHistory()

    let editorRef = null
    // const [editorContent, setEditorContent] = useLocalStorage('new-post-content', {"time":1597330033064,"blocks":[{"type":"header","data":{"text":"Lorem Ipsum","level":2}},{"type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}}],"version":"2.18.0"})
    const [editorContent, setEditorContent] = useState({"time":1597330033064,"blocks":[{"type":"header","data":{"text":"Lorem Ipsum","level":2}},{"type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}}],"version":"2.18.0"})
    const [articleTitle, setArticleTitle] = useState('')
    const [overviewUrl, setOverviewUrl] = useState(null)
    const [categoriesIds, setCategoriesIds] = useState([])
    // const [imgIsLoading, setImagLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const [isNew, setIsNew] = useState(create ? true : false)
    const [articleId, setArticleId] = useState(article || null)

    const changeEditor = (e, data) => {
        if(data.blocks && data.blocks.length > 0) setEditorContent(data)
        else setEditorContent(null)
    }

    const checkErrors = () => {
        let errorsList = []

        if(articleTitle === '' || !articleTitle) {
            errorsList.push('Article title is required')
        }

        if(!overviewUrl) {
            errorsList.push('Article overview image is required')
        }

        if(!editorContent || !editorContent.blocks || editorContent.blocks < 2) {
            errorsList.push('Article content is not accepted')
        }

        // if(imgIsLoading) {
        //     errorsList.push('Wait until the overview image is loaded')
        // }
        
        setErrors(errorsList)

        return errorsList
    }

    const save = async () => {
        const checkedErrors = checkErrors()
        
        if(checkedErrors.length > 0) return

        openModel(<LoadingModel />, false)
        const payload = {'title': articleTitle, 'content': JSON.stringify(editorContent), 'overview': overviewUrl, 'categories': categoriesIds}
        const method = isNew ? 'POST': 'PUT'
        const url = !isNew && articleId ? `http://localhost:8000/api/articles/${articleId}` : 'http://localhost:8000/api/articles/'
        const options = { method, body: JSON.stringify(payload), headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'}}
        const req = await fetch(url, options)

        const data = await req.json()

        if(req.status >= 200 && req.status < 300) {
            setIsNew(false)
            setArticleId(data.id)
        } else {
            if (data.details) setErrors([data.details])
            else setErrors(['Something went wrong on the server'])
        }
        setTimeout(closeModel, 1000)
    }

    const previewArticle = () => {
        history.push(`/articles/${articleId}`)
    } 

    const getArticle = async (id) => {
        openModel(<LoadingModel />, false)

        const req = await fetch(`http://localhost:8000/api/articles/${id}`, )
        if(!(req.status >= 200 && req.status < 300) ) {
            history.replace('/NotFound')
            setTimeout(closeModel, 1000)
            return
        }

        const data = await req.json()
        
        if(data.author.id !== user.id) {
            history.push(`/articles/${data.id}`)
            return
        }
        const title = data.title
        const overview = data.overview
        const content = JSON.parse(data.content)
        if(editorRef) {
            await editorRef.isReady
            editorRef.render(content)
        }
        setEditorContent(content)
        setOverviewUrl(overview)
        setArticleTitle(title)
        setCategoriesIds(data.categories.map(item => item.id))
        setTimeout(closeModel, 1000)
    }

    useEffect(() => {
        if(!isNew && !articleId) {
            setArticleId(params.id)
            getArticle(params.id)
        }

        if(!isNew && articleId) {
            getArticle(articleId)
        }
    }, [])

    return (
        <div className='PostPage'>
            <h1>{create ? 'Post New Article': 'Update Article'}</h1>

            <input className='title-input' onChange={e => setArticleTitle(e.target.value)} type='text' value={articleTitle} placeholder='Article Title' />

            <OverviewDiv init={overviewUrl} setGlobal={setOverviewUrl} />

            <div className='editor'>
                <EditorJs 
                instanceRef={async instance => editorRef = instance }
                data={editorContent} onChange={changeEditor} tools={EDITOR_JS_TOOLS} />
            </div>

            <CategoriesProvider>
                <ArticleCategories init={categoriesIds} setGlobal={setCategoriesIds} />
            </CategoriesProvider>            
            
            <div className='errors-div'>
                {errors.map((err, i) => (<p key={i} className='error'>{err}</p>))}
            </div>
            <div className='btns-div'>
                {/* <button onClick={clearEditor} className='btn btn-orange btn-elt'>clear</button> */}
                <button onClick={save} className='btn btn-primary btn-elt'>save</button>
                <button onClick={previewArticle} disabled={isNew && !articleId} className='btn btn-primary btn-elt'>preview</button>
            </div>
        </div>
    )
}
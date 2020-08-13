import React from 'react'
import EditorJs from 'react-editor-js'

import '../styles/PostPage.scss'

import { EDITOR_JS_TOOLS } from '../components/editorTools'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const PostPage = () => {
    const [editorContent, setEditorContent] = useLocalStorage('new-post-content', {"time":1597330033064,"blocks":[{"type":"header","data":{"text":"Lorem Ipsum","level":2}},{"type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}}],"version":"2.18.0"}) 
    
    const changeEditor = (e, data) => {
        setEditorContent(data)
    }

    return (
        <div className='PostPage'>
            <h1>Post New Article</h1>

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
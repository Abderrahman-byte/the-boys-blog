import { useContext } from 'react'

import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'

const uploadByFile = async (file) => {
    const token = JSON.parse(localStorage.getItem('token'))
    const formData = new FormData()
    formData.append('image', file)
    const options = {
        method: 'POST',
        body: formData,
        headers : {
            'Authorization': `Token ${token}`
        }
    }
    const req = await fetch('http://localhost:8000/api/articles/images', options)
    const data = await req.json()

    return data
}

export const EDITOR_JS_TOOLS = {
    embed: Embed,
    table: Table,
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    simpleImage: SimpleImage,
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByFile: uploadByFile 
            }
        }
    },
    // raw: Raw,
    header: {
        class: Header,
        inlineToolbar: true,
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    // marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    Marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
    }
}
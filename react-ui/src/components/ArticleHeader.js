import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import '../styles/ArticleHeader.scss'

import { AuthContext } from '../context/AuthContext'
import { ModelsContext } from '../context/ModelsContext'
import { ConfirmModel } from './ConfirmModel'

export const ArticleHeader = ({author, pubdate, id, setDefault, categories}) => {
    const { user, token } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)
    const history = useHistory()

    const deleteArticle = async () => {
        const req = await fetch(`http://localhost:8000/api/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if(req.status >= 200 && req.status < 300) {
            history.replace('/')
            setDefault()
        }

        closeModel()
    }

    const handleDelete = () => {
        if(user && user.id === author.id) {
            openModel(<ConfirmModel text='Do you want to delete this article ?' callback={deleteArticle} />, true)
        } 
    }
    
    return (
        <div className='ArticleHeader'>
            <div className='top'>
                <div className='control'>
                    {user && user.id === author.id ? (
                        <>
                            <Link to={`/staff/edit-article/${id}`} className='edit tooltip tooltip-right'  data-title='Edit Article'><i className='fas fa-cog'></i></Link>
                            <Link onClick={handleDelete} to='#' className='delete tooltip tooltip-top' data-title='Delete Article'><i className='fas fa-trash'></i></Link>
                        </>
                    ) : (null)}    
                </div>
                <p className='desc'>Published at {(new Date(pubdate)).toLocaleString()} <span>|</span> by <Link to="#" className='author'>{author.first_name} {author.last_name}</Link></p>
            </div>

            <div className='bottom'>
                {categories.map(category => <Link key={category.id} to='#'>{category.title}</Link>)}
            </div>
        </div>
    )
}
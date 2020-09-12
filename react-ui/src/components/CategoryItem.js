import React, { useContext } from 'react'

import '../styles/CategoryItem.scss'

import { ConfirmModel } from '../components/ConfirmModel'
import { ModelsContext } from '../context/ModelsContext'
import { CategoriesContext } from '../context/CategoriesContext'

export const CategoryItem = ({data}) => {
    const { openModel, closeModel } = useContext(ModelsContext)
    const { deleteCategory } = useContext(CategoriesContext)

    const deleteItem = async () => {
        await deleteCategory(data.id)
        closeModel()
    }

    const handleDelete = () => {
        openModel(<ConfirmModel text='Do you realy want to delete this categorie ?' callback={deleteItem} />)
    }

    return (
        <div className='CategoryItem'>
            <p className='title'>{data.title}</p>
            <button onClick={handleDelete} className='deleter'><i className='fas fa-times'></i> </button>
        </div>
    )
}
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import '../styles/ConfirmModel.scss'

import { ModelsContext } from '../context/ModelsContext'

export const ConfirmModel = ({text, callback}) => {
    const { closeModel } = useContext(ModelsContext)

    return (
        <div className='ConfirmModel'>
            <button className='closer' onClick={() => closeModel()}><i className='fas fa-times'></i></button>
            <p className='text'>{text}</p>
            <button className='confirm-btn' onClick={callback} >Confirm</button>
        </div>
    )
}

ConfirmModel.propTypes = {
    'text': PropTypes.string.isRequired,
    'callback': PropTypes.func.isRequired
}
import React, { createContext, useState } from 'react'

import styles from '../styles/Models.module.scss'

export const ModelsContext = createContext({})

export const ModelsProvider = ({children}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [model, setModel] = useState(null)
    const [closable, setClosable] = useState(false)

    const openModel = (model, closable=false) => {
        setIsOpen(true)
        setModel(model)
        setClosable(closable)
    }

    const closeModel = () => {
        setIsOpen(false)
        setModel(null)
    }

    return (
        <ModelsContext.Provider value={{ openModel, closeModel }}>
            {children}
            
            {isOpen && closeModel ? (
                <div className={styles.model_container}>
                    <div className={styles.backdrop} onClick={closable ? closeModel : null}></div>
                    {model}
                </div>
            ) : (null)}

        </ModelsContext.Provider>
    )
}
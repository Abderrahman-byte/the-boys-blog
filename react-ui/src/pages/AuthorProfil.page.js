import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { ModelsContext } from '../context/ModelsContext'
import { LoadingModel } from '../components/LoadingModel'
import { ProfilPage } from '../pages/Profil.page'

export const AuthorProfilPage = () => {
    const { id } = useParams()
    const { openModel, closeModel } = useContext(ModelsContext)
    const [isLoading, setLoadingState] = useState(true)
    const [profil, setProfil] = useState(null)

    const getAuthor = async () => {
        openModel(<LoadingModel />, false)
        const req = await fetch(`http://localhost:8000/api/user-info/${id}`)

        if(req.status >= 200 && req.status < 300) {
            let data = null
            try { data = await req.json()}
            catch (err) { data = null }
            
            setProfil(data)
        }

        setLoadingState(false)
        setTimeout(closeModel, 1000)
    }

    useEffect(() => {
        getAuthor()
    }, [id])

    if(isLoading) {
        return (<></>)
    } else if(profil && profil.id) {
        return <ProfilPage profil={profil} />
    } else {
        return (
            <div>This profil does not exist you should make 404 page</div>
        )
    }
}
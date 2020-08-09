import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'

import '../styles/LoginPage.scss'

import { AuthContext } from '../context/AuthContext'
import { RegisterForm } from '../components/RegisterForm'

export const RegisterPage = (props) => {
    const { user, isAuthenticated } = useContext(AuthContext)
    const from = props.location.state ? props.location.state.from : null

    if(user === undefined ) {
        return (
            <div>
                <p>...Waiting</p>
            </div>
        )
    } else if (user && isAuthenticated) {
        return <Redirect to={from || ''} />
    } else {
        return (
            <div className="LoginPage">
                <RegisterForm />
            </div>
        )
    }
}
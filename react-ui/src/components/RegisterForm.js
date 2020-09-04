import React, { useContext, useState } from 'react'

import '../styles/LoginForm.scss'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LoadingModel } from './LoadingModel'
import { ModelsContext } from '../context/ModelsContext'

export const RegisterForm = () => {
    const { setUser, setAuth, setToken } = useContext(AuthContext)
    const { openModel, closeModel } = useContext(ModelsContext)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')

    const [usernameError, setErrorUsername] = useState(null)
    const [emailError, setErrorEmail] = useState(null)
    const [password1Error, setErrorPassword1] = useState(null)
    const [password2Error, setErrorPassword2] = useState(null)

    const [addError, setAddError] = useState(null)

    const checkUsername = () => {
        const regex = /^[A-za-z]{4,}\w*$/

        if(username === '') {
            setErrorUsername('Username Field is required')
            return false
        }

        if(username.length < 6) {
            setErrorUsername('Username must contain at least 6 characteres')
            return false
        }

        if(!regex.test(username)) {
            setErrorUsername('Username must contain letter uppercase or lowercase or digits.')
            return false
        }

        setErrorUsername(null)
        return true
    }

    const checkEmail = () => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(email === '') {
            setErrorEmail('Email Address Field required')
            return false
        }

        if(!regex.test(email)) {
            setErrorEmail('Invalid email address !')
            return false
        }

        setErrorEmail(null)
        return true
    }

    const checkPassword = () => {
        const regex = /(?=.*?[A-Z]+)(?=.*?[a-z]+.?)(?=.*?[0-9]+).*/

        if(password1 === '') {
            setErrorPassword1('Password Field required')
            return false
        }

        if(password1.length < 8) {
            setErrorPassword1('Password must contain at least 8 characters')
            return false
        }

        if(!regex.test(password1)) {
            setErrorPassword1('Password must contain letters uppercase and lowercase and digits')
            return false
        }

        setErrorPassword1(null)
        return true
    }

    const checkMatchPassword = () => {
        if(password1 !== password2) {
            setErrorPassword2('Password Doesn\'t match at all.')
            return false
        }

        setErrorPassword2(null)
        return true
    }

    const register = async () => {
        openModel(<LoadingModel />, false)
        const payload = {username, email, password: password1}
        const reqOptions = {
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const req = await fetch('http://localhost:8000/api/register', reqOptions)
        const data = await req.json()
        console.log(data)

        if(req.status >= 200 && req.status < 300) {
            if(data.token) {
                setToken(data.token)
            }

            if(data.user) {
                setAuth(true)
                setUser(data.user)
            }
        } else {
            if(data.details) {
                setAddError(data.details)
            } else {
                setAddError('Something goes wrong')
            }
        }
        setTimeout(closeModel, 1000)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const usernameVerified = checkUsername()
        const emailVerified = checkEmail()
        const passwordVerified = checkPassword()
        const passwordsMatch = checkMatchPassword()

        
        if(usernameVerified && emailVerified && passwordVerified && passwordsMatch) {
            register()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="LoginForm RegisterForm">
            <div className='form-header'>
                <h6>Create new account</h6>
                <p>Stay informed on our latest news and articles!</p>
            </div>
            <div className={usernameError ? 'form-group error': 'form-group'}>
                <input 
                    onInput={() => setErrorUsername(null)} 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    className='form-control' 
                    type='text' 
                    placeholder='Username' 
                    required 
                />
                {usernameError ? (<small>{usernameError}</small>) : null}
            </div>
            <div className={emailError ? 'form-group error': 'form-group'}>
                <input 
                    onInput={() => setErrorEmail(null)} 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className='form-control' type='email' 
                    placeholder='Email address' 
                    required 
                />
                {emailError ? (<small>{emailError}</small>) : null}
            </div>
            <div className={password1Error ? 'form-group error': 'form-group'}>
                <input 
                    onInput={() => setErrorPassword1(null)} 
                    value={password1} 
                    onChange={e => setPassword1(e.target.value)} 
                    className='form-control' 
                    type='password' 
                    placeholder='Password' 
                    required 
                />
                {password1Error ? (<small>{password1Error}</small>) : null}
            </div>
            <div className={password2Error ? 'form-group error': 'form-group'}>
                <input 
                    onInput={() => setErrorPassword2(null)} 
                    value={password2} 
                    onChange={e => setPassword2(e.target.value)} 
                    className='form-control' 
                    type='password' 
                    placeholder='Password Confirmation' 
                    required 
                />
                {password2Error ? (<small>{password2Error}</small>) : null}
            </div>

            {addError ? (
                <div className='error-div'>
                    <p>{addError}</p>
                </div>
            ): null}

            <button className='submit'>Create</button>

            <Link className='footer' to='/login'>Already have an account?</Link>
        </form>
    )
}
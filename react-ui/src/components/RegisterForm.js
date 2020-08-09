import React, { useContext, useState } from 'react'

import '../styles/LoginForm.scss'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const RegisterForm = () => {
    const { setUser, setAuth, setToken } = useContext(AuthContext)
    
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')

    const [usernameError, setErrorUsername] = useState(null)
    const [emailError, setErrorEmail] = useState(null)
    const [password1Error, setErrorPassword1] = useState(null)
    const [password2Error, setErrorPassword2] = useState(null)

    const [addError, setAddError] = useState(null)

    return (
        <form className="LoginForm RegisterForm">
            <div className='form-header'>
                <h6>Create new account</h6>
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
                    <p>hgehghegehgeheghegehgehgehegeghegheg</p>
                </div>
            ): null}

            <button className='submit'>Create</button>

            <Link className='footer' to='/login'>Already have an account?</Link>
        </form>
    )
}
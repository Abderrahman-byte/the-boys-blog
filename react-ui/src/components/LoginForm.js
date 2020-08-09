import React, { useState, useContext } from 'react'

import '../styles/LoginForm.scss'

import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const LoginForm = () => {
    const { setUser, setToken, setAuth } = useContext(AuthContext)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const login = async () => {
        const payload = {username, password}
        const reqOptions = {
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const req = await fetch('http://localhost:8000/api/login', reqOptions)
        const data = await req.json()

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
                setError(data.details)
            } else {
                setError('Something goes wrong')
            }
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        setError(null)
        if(username !== '' && password !== '') {
            login()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="LoginForm">
            <div className='form-header'>
                <h6>Login to your account</h6>
                <p>Don't have an account ? <Link to='/register'>Sign up</Link></p>
            </div>
            <div className="form-group">
                <input 
                    className='form-control' 
                    type='text' 
                    value={username} 
                    onInput={() => setError(null)}
                    onChange={e => setUsername(e.target.value)} 
                    placeholder='Username' 
                    required 
                />
            </div>
            <div className="form-group">
                <input 
                    className='form-control' 
                    type='password' 
                    value={password} 
                    onInput={() => setError(null)}
                    onChange={e => setPassword(e.target.value)} 
                    placeholder='Password' 
                    required 
                />
            </div>

            
            <Link className='forgot-pass' to='#'>Forgot Password ?</Link>
        
            {error ? (
                <div className='error-div'>
                    <p>{error}</p>
                </div>
            ): (null)}

            <button className='submit'>Login</button>
        </form>
    )
}
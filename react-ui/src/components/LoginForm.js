import React, { useState } from 'react'

import '../styles/LoginForm.scss'
import { Link } from 'react-router-dom'

export const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, seterror] = useState(null)
    return (
        <form className="LoginForm">
            <div className='form-header'>
                <h6>Login to your account</h6>
                <p>Don't have an account ? <Link to='/register'>Sign up</Link></p>
            </div>
            <div className="form-group">
                <input className='form-control' type='text' placeholder='Username' />
            </div>
            <div className="form-group">
                <input className='form-control' type='password' placeholder='Password' />
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
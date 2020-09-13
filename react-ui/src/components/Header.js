import React, { useContext, useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import '../styles/Header.scss'

import { AuthContext } from '../context/AuthContext'

export const Header = () => {
    const { user, isAuthenticated } = useContext(AuthContext)
    const { pathname } = useLocation()
    const headerRef = useRef(null)
    const [navStatus, setNavStatus] = useState(false)
    // const [isFixed, setFixedStatus] = useState(false)

    const toggleDropdown = e => {
        e.preventDefault()
        let target = e.target

        if(!target.classList.contains('dropdown')) {
            target = target.parentNode
        }

        if(!target.classList.contains('dropdown')) {
            target = target.parentNode
        }

        target.classList.toggle('active')
    }

    const toggleNavBar = () => {
        setNavStatus(!navStatus)
    }

    // const handleScroll = (e) => {
    //     const top = window.pageYOffset
    //     const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0
    //     if(top > headerHeight) {
    //         setFixedStatus(true)
    //     } else if(top === 0) {
    //         setFixedStatus(false)
    //     }
    // }

    useEffect(() => {
        setNavStatus(false)
    }, [pathname])

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll)
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll)
    //     }
    // }, [])

    return (
        <header ref={headerRef} className='Header'>
            <NavLink to='' className='logo-btn'>
                {/* <img  alt='the boys logo'/> */}
                <h1 className='logo'>The Boys Blog</h1>
            </NavLink>
            
            <nav className={navStatus ? 'navbar': 'navbar hide'}>
                <ul>
                    <li><NavLink exact to=''>Home</NavLink></li>
                    <li><NavLink exact to='/categories'>Categories</NavLink></li>
                    <li><NavLink exact to='/team'>Team</NavLink></li>

                    {user && user.is_staff ? (
                        <li onClick={toggleDropdown} className='dropdown'>
                            <a href='#'>Staff <i className="fas fa-chevron-up up"></i><i className="fas fa-chevron-down down"></i></a>
                            <ul className='dropdown-menu'>
                                <li><NavLink to='/staff/profil'>Profil</NavLink></li>
                                <li><NavLink exact to='/staff/new-post'>Write Article</NavLink></li>
                                {user.is_superuser ? (
                                    <>
                                        <li><NavLink exact to='/admin/categories'>Edit Categories</NavLink></li>
                                        <li><NavLink exact to='/admin/staff'>Add Staff</NavLink></li>
                                    </>
                                ) : null}
                            </ul>
                        </li>
                    ) : null}

                    <li><NavLink exact to='/about'>About</NavLink></li>
                    <li><NavLink exact to='/contact'>Contact</NavLink></li>

                    {user && isAuthenticated ? (
                        <li><NavLink exact to={{pathname: '/logout', state: { from:  pathname}}} className='btn btn-orange'>Logout</NavLink></li>
                    ) : (
                        <>
                            <li><NavLink exact to={{pathname: '/login', state: { from:  pathname}}} className='btn btn-primary'>Login</NavLink></li>
                            <li><NavLink exact to={{pathname: '/register', state: { from:  pathname}}} className='btn btn-primary'>Sign Up</NavLink></li>
                        </>
                    )}
                    
                </ul>
            </nav>

            <div onClick={toggleNavBar} className={navStatus ? 'backdrop': 'backdrop hidden'}></div>

            <div onClick={toggleNavBar} className='nav-toggle'>
                <i className={navStatus ? 'fas fa-bars hidden': 'fas fa-bars'}></i>
                <i className={navStatus ? 'fas fa-times': 'fas fa-times hidden'}></i>
            </div>
        </header>
    )
}
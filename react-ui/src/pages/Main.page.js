import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import '../styles/MainPage.scss'

import { Wallpaper } from '../components/Wallpaper'
import { ArticlePage } from './Article.page'
import { HomePage } from './Home.page'
import { CategoriesPage } from './Categories.page'
import { CategoriesProvider } from '../context/CategoriesContext'

export const MainPage = () => {
    const [wallpaperImg, setWallpaperImg] = useState('http://localhost:8000/media/images/wp-1.jpg')
    const [headerText, setHeaderText] = useState('Grow fast or die slow')

    const setDefault = () => {
        setWallpaperImg('http://localhost:8000/media/images/wp-1.jpg')
        setHeaderText('Grow fast or die slow')
    }

    return (
        <div className='MainPage'>
            <Wallpaper src={wallpaperImg} text={headerText} />

            <Switch>
                <Route exact path='/'>
                    <HomePage setDefault={setDefault} />
                </Route>

                <Route exact path='/categories'>
                    <CategoriesProvider>
                        <CategoriesPage 
                            setDefault={setDefault} 
                            setWallpaperImg={setWallpaperImg} 
                            setHeaderText={setHeaderText} 
                        />
                    </CategoriesProvider>
                </Route>
                
                <Route exact path='/articles/:id'>
                    <ArticlePage setDefault={setDefault} setWallpaper={setWallpaperImg} setTitle={setHeaderText} />
                </Route>

                
            </Switch>
        </div>
    )
}
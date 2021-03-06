import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import '../styles/MainPage.scss'

import { Wallpaper } from '../components/Wallpaper'
import { ArticlePage } from './Article.page'
import { HomePage } from './Home.page'
import { CategoriesPage } from './Categories.page'
import { CategoriesProvider } from '../context/CategoriesContext'
import { CategoryPage } from './Category.page'
import { TeamPage } from './Team.page'
import { SearchPage } from './Search.page'

export const MainPage = () => {
    const [wallpaperImg, setWallpaperImg] = useState('http://localhost:8000/media/images/wp-1.jpg')
    const [headerText, setHeaderText] = useState('the boys are here')

    const setDefault = () => {
        setWallpaperImg('http://localhost:8000/media/images/wp-1.jpg')
        setHeaderText('the boys are here')
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

                <Route exact path='/category/:title'>
                    <CategoryPage 
                        setDefault={setDefault}
                        setWallpaperImg={setWallpaperImg}
                        setHeaderText={setHeaderText}
                    />
                </Route>

                <Route exact path='/team'>
                    <TeamPage 
                        setDefault={setDefault}
                        setWallpaperImg={setWallpaperImg}
                        setHeaderText={setHeaderText}
                    />
                </Route>

                <Route exact path='/search'>
                    <SearchPage setDefault={setDefault} />
                </Route>
                
                <Route exact path='/articles/:id'>
                    <ArticlePage setDefault={setDefault} setWallpaper={setWallpaperImg} setTitle={setHeaderText} />
                </Route>

                <Route render={() => <Redirect to='/NotFound' />} />
                
            </Switch>
        </div>
    )
}
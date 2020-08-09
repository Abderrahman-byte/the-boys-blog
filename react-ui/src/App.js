import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './App.scss'
import './styles/Forms.scss'

import { Header } from './components/Header'
import { MainPage } from './pages/Main.page'
import { LoginPage } from './pages/Login.page'

const App = () => {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='' component={MainPage} />
      </Switch>
    </div>
  )
}

export default App

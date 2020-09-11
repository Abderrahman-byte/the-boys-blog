import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'

import './App.scss'
import './styles/Forms.scss'

import { Header } from './components/Header'
import { MainPage } from './pages/Main.page'
import { LoginPage } from './pages/Login.page'
import { RegisterPage } from './pages/Register.page'
import { Logout } from './components/Logout'
import { StaffOnlyRouter } from './components/StaffOnly'
import { StaffPages } from './pages/Staff.pages'
import { AuthorProfilPage } from './pages/AuthorProfil.page'
import { AdminOnly } from './components/AdminOnly'
import { AdminPages } from './pages/Admin.pages'
import { NotFound } from './pages/NotFound'

const App = () => {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/register' component={RegisterPage} />
        <Route exact path='/logout' component={Logout} />
        <Route path='/authors/:id' component={AuthorProfilPage} />

        <StaffOnlyRouter path='/staff' component={StaffPages} />
        <AdminOnly path='/admin' component={AdminPages} />

        <Route path='/NotFound' component={NotFound} />

        <Route path='' component={MainPage} />
      </Switch>
    </div>
  )
}

export default App

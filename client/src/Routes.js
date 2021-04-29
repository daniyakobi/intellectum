import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Course from './Pages/Course/Course'
import Article from './Pages/Article/Article'
import Main from './Pages/Main'
import NotFound from './Pages/404/NotFound'
import Auth from './Pages/Auth/Auth'
import Register from './Pages/Auth/Register'
import Profile from './Pages/Profile/Profile'
import MainInfo from './Pages/Profile/components/MainInfo'
import Bonus from './Pages/Profile/components/Bonus'

export const useRoutes = (isAuth, role) => {
  if(isAuth) {
    return (
      <Switch>
        <Route path="/all-courses/course/:id">
          <Course />
        </Route>
        <Route path="/blog/:id">
          <Article />
        </Route>
        <Route path='/'>
          <Main />
        </Route>
        <Route path="/404" exact>
          <NotFound />
        </Route>
        <Redirect to='/profile/main-info' />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route path="/login" exact>
        <Auth />
      </Route>
      <Route path="/register" exact>
        <Register />
      </Route>
      <Route path="/404" exact>
        <NotFound />
      </Route>
      <Redirect to="/login" />
    </Switch>
  )
}
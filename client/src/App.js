import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from './Routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/auth.context'
import 'materialize-css'
import 'animate.css'

import { Route, Redirect, Switch } from 'react-router-dom'
import Course from './Pages/Course/Course'
import Article from './Pages/Article/Article'
import Main from './Pages/Main'
import NotFound from './Pages/404/NotFound'
import Auth from './Pages/Auth/Auth'
import Reset from './Pages/Auth/Reset'
import Password from './Pages/Auth/Password'
import Register from './Pages/Auth/Register'
import About from './Pages/About/About'
import Blog from './Pages/Blog/Blog'
import Courses from './Pages/Courses/Courses'
import Profile from './Pages/Profile/Profile'
import Teachers from './Pages/Teachers/Teachers'

function App() {
  const {token, login, logout, userId, userRole} = useAuth()
  const isAuth = !!token
  // const routes = useRoutes(isAuth, userRole);

  return (
    <AuthContext.Provider value={{token, login, logout, userId, isAuth, userRole}}>
      <BrowserRouter>
        <div className="app">
          { isAuth ? 
            <>
              <Route path="/all-courses/:id">
                <Course />
              </Route>
              <Route path='/'>
                <Main userId={userId}/>
                <div className="app-container">
                  <Route path="/profile/"><Profile userId={userId} /></Route>
                  <Route path="/about" exact><About userId={userId} /></Route> 
                  <Route path="/all-courses"><Courses userId={userId} /></Route>
                  <Route path="/teachers"><Teachers userId={userId} /></Route>
                </div>
              </Route>
              <Route path="/404" exact>
                <NotFound />
              </Route>
              <Redirect to='/profile/main-info' /> 
            </>:
            <Switch>
              <Route path="/login" exact>
                <Auth />
              </Route>
              <Route path="/reset" exact>
                <Reset />
              </Route>
              <Route path="/password/:token">
                <Password />
              </Route>
              <Route path="/register" exact>
                <Register />
              </Route>
              <Route path="/404" exact>
                <NotFound />
              </Route>
              <Redirect to="/login" />
            </Switch>
          }
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

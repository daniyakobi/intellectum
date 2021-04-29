import React, { useContext, useState, useEffect, useCallback } from 'react'
import {Switch, Route, Redirect, NavLink} from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/auth.context'
import {useHttp} from '../hooks/http.hook'
import HeaderUser from './Default/Header/HeaderUser'
import Logo from './Default/Header/Logo'

const Main = (userId) => {
  const auth = useContext(AuthContext)
  const {loading, request} = useHttp()
  const [user, setUser] = useState(null)
  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [userId, auth.token, request])

  useEffect(() => {
    getUser()
  }, [getUser])

  if(loading) {
    console.log('Загрузка')
  }  

  const exitHandler = async () => {
    try {
      auth.logout()
    } catch (e) {}
  }

  return(
    <div className="main">
      <header className="header flex-row">
        <Logo class={ 'header__logo' } />
        <div className="header__menu menu">
          <ul className=" menu__list flex-row">
            <li className="menu__item"><NavLink to="/all-courses" className="menu__link"><span className="text-18">Все курсы</span></NavLink></li>
            <li className="menu__item"><NavLink to="/teachers" className="menu__link"><span className="text-18">Наши преподаватели</span></NavLink></li>
            <li className="menu__item"><NavLink to='/about' className="menu__link"><span className="text-18">О платформе</span></NavLink></li>
          </ul>
        </div>
        { !loading && user ? <HeaderUser user={user} /> : <button className="header__login login text-16 flex-center" onClick={ exitHandler } >Выйти</button> }
      </header>
    </div>
  )
}

export default Main
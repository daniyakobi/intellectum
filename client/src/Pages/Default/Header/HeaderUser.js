import React, { useContext, useState } from 'react'
import './Header.css'
import { AuthContext } from '../../../context/auth.context'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { NavLink } from 'react-router-dom'
import menuButton from '../../../img/menu-arrow.svg'
import defaultAvatar from '../../../img/default.png'
import bell from '../../../img/bell.svg'
import bonus from '../../../img/bonus.svg'
import dashboardIcon from '../../../img/sidebar/src/space_dashboard.svg'
import bonusIcon from '../../../img/sidebar/src/loyalty.svg'
import learnIcon from '../../../img/sidebar/src/library_books.svg'
import messagesIcon from '../../../img/sidebar/src/messages.svg'
import settingsIcon from '../../../img/sidebar/src/settings.svg'
import logoutIcon from '../../../img/sidebar/logout.svg'
import createCourseIcon from '../../../img/sidebar/src/library_add.svg'
import directionsIcon from '../../../img/sidebar/src/list.svg'
import usersIcon from '../../../img/sidebar/src/users.svg'

const Header = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  const loginUserHandle = () => {
    if(document.querySelector('.login__user-notifications-block').classList.contains('active')) {
      document.querySelector('.login__user-notifications-block').classList.toggle('active')
      document.querySelector('.login__user-notifications-button').classList.toggle('active')
    }
    let menu = document.querySelector('.login__user-menu')
    let button = document.querySelector('.login__user-menu-button')
    menu.classList.toggle('active')
    button.classList.toggle('active')
  }

  const loginNotifyHandle = () => {
    if(document.querySelector('.login__user-menu').classList.contains('active')) {
      document.querySelector('.login__user-menu').classList.toggle('active')
      document.querySelector('.login__user-menu-button').classList.toggle('active')
    }
    let menu = document.querySelector('.login__user-notifications-block');
    let button = document.querySelector('.login__user-notifications-button')
    menu.classList.toggle('active')
    button.classList.toggle('active')
  }

  const exitHandler = async () => {
    try {
      const data = await request('/api/auth/logout', 'POST', null, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      auth.logout()
    } catch (e) {}
  }

  let userAvatar = defaultAvatar
  if( user.avatar ) {
    userAvatar = user.avatar
  } 

  return (
    <div className="login__user flex-row">
      <div className="login__user-notifications">
        <button className="login__user-notifications-button popup-button" onClick={ loginNotifyHandle }>
          <img src={ bell } alt="Открыть уведомления" />
        </button>
        <div className="login__user-notifications-block popup">
          <h3 className="login__user-notifications-title text-20">Уведомления</h3>
          <div className="login__user-notifications-list flex-center">
            
          </div>
          <NavLink to="/profile/notifications" className="login__user-notifications-more flex-center text-16">Показать все уведомления</NavLink>
        </div>
      </div>
      <div className="login__bonus">
        <span className="flex-row sidebar__count text-16">
          <img src={ bonus } alt={ 'Бонусные рубли' } />
          { user.bonusCurrent }
        </span>   
      </div>
      <NavLink to="/profile/main-info" className="login__user-name text-18">{ user.subname + ' ' + user.name }</NavLink>
      <button className="login__user-menu-button popup-button" onClick={ loginUserHandle }>
        <img src={ menuButton } alt="Открыть меню пользователя" />
      </button>
      <div className="login__user-menu popup">
        <ul className="flex-column">
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/main-info' ><img src={ dashboardIcon } alt="Рабочий стол" /><span>Рабочий стол</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/bonus' ><img src={ bonusIcon } alt="Программа лояльности" /><span>Программа лояльности</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/my-courses' ><img src={ learnIcon } alt="Мои курсы" /><span>Мои курсы</span></NavLink></li>
          { user.role === 0 ? '' : <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/create-course' ><img src={ createCourseIcon } alt="Создать курс" /><span>Создать курс</span></NavLink></li> }
          { user.role === 0 ? '' : <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/directions' ><img src={ directionsIcon } alt="Направления обучения" /><span>Направления обучения</span></NavLink></li> }
          { user.role === 2 ? <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/users' ><img src={ usersIcon } alt="Все пользователи" /><span>Все пользователи</span></NavLink></li> : '' }
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/feedback' ><img src={ messagesIcon } alt="Сообщения" /><span>Сообщения</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/settings' ><img src={ settingsIcon } alt="Настройки профиля" /><span>Настройки профиля</span></NavLink></li>
          <li className="sidebar__item"><a className="sidebar__link text-16 flex-row" onClick={ exitHandler }><img src={ logoutIcon } alt="Выход" /><span>Выход</span></a></li>
        </ul>
      </div>
    </div>
  )
}

export default Header
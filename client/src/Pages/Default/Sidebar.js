import React, { useContext } from 'react'
import { AuthContext } from '../../context/auth.context'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import dashboardIcon from '../../img/sidebar/src/space_dashboard.svg'
import bonusIcon from '../../img/sidebar/src/loyalty.svg'
import learnIcon from '../../img/sidebar/src/library_books.svg'
import messagesIcon from '../../img/sidebar/src/messages.svg'
import settingsIcon from '../../img/sidebar/src/settings.svg'
import logoutIcon from '../../img/sidebar/logout.svg'
import createCourseIcon from '../../img/sidebar/src/library_add.svg'
import directionsIcon from '../../img/sidebar/src/list.svg'
import usersIcon from '../../img/sidebar/src/users.svg'

const Sidebar = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  const exitHandler = async () => {
    try {
      const data = await request('/api/auth/logout', 'POST', null, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      auth.logout()
    } catch (e) {}
  }

  const sidebarSticky = () => {
    window.addEventListener('scroll', function() {
      const sidebar = document.querySelector('.sidebar')
      sidebar.classList.remove('sticky')
      if (window.scrollY >= 120) {
        sidebar.classList.add('sticky')
      } else { sidebar.classList.remove('sticky') }
    });
  }

  return (
    <div className="sidebar__menu">
      { sidebarSticky() }
      <ul className="flex-column">
        <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/main-info' ><img src={ dashboardIcon } alt="Рабочий стол" /><span>Рабочий стол</span></NavLink></li>
        <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/bonus' ><img src={ bonusIcon } alt="Программа лояльности" /><span>Программа лояльности</span></NavLink></li>
        <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/my-courses' ><img src={ learnIcon } alt="Мои курсы" /><span>Мои курсы</span></NavLink></li>
        { user.role === 0 ? '' : <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/create-course' ><img src={ createCourseIcon } alt="Создать курс" /><span>Создать курс</span></NavLink></li> }
        { user.role === 0 ? '' : <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/directions' ><img src={ directionsIcon } alt="Направления обучения" /><span>Направления обучения</span></NavLink></li> }
        { user.role === 2 ? <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/users' ><img src={ usersIcon } alt="Все пользователи" /><span>Все пользователи</span></NavLink></li> : '' }
        <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/messages' ><img src={ messagesIcon } alt="Сообщения" /><span>Сообщения</span></NavLink></li>
        <li className="sidebar__item" style={{marginBottom: 0}}><NavLink className="sidebar__link flex-row" to='/profile/settings' ><img src={ settingsIcon } alt="Настройки профиля" /><span>Настройки профиля</span></NavLink></li>
        <li><div className="info__line"></div></li>
        <li className="sidebar__item"><a className="sidebar__link flex-row" onClick={ exitHandler }><img src={ logoutIcon } alt="Выход" /><span>Выход</span></a></li>
      </ul>
    </div>
  )
}

export default Sidebar
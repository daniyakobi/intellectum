import React, { useContext, useState } from 'react'
import './Header.css'
import { AuthContext } from '../../../context/auth.context'
import { NavLink } from 'react-router-dom'
import menuButton from '../../../img/menu-arrow.svg'
import defaultAvatar from '../../../img/default.png'
import bell from '../../../img/bell.svg'
import bonus from '../../../img/bonus.svg'
import dashboardIcon from '../../../img/sidebar/src/space_dashboard.svg'
import bonusIcon from '../../../img/sidebar/src/loyalty.svg'
import learnIcon from '../../../img/sidebar/src/library_books.svg'
import feedbackIcon from '../../../img/sidebar/src/feedback.svg'
import notificationsIcon from '../../../img/sidebar/src/notifications.svg'
import settingsIcon from '../../../img/sidebar/src/settings.svg'
import logoutIcon from '../../../img/sidebar/logout.svg'
import createCourseIcon from '../../../img/sidebar/src/library_add.svg'
import directionsIcon from '../../../img/sidebar/src/list.svg'
import usersIcon from '../../../img/sidebar/src/users.svg'

const Header = ({ user }) => {
  const auth = useContext(AuthContext)

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
          <img src={ bell } alt="?????????????? ??????????????????????" />
        </button>
        <div className="login__user-notifications-block popup">
          <h3 className="login__user-notifications-title text-20">??????????????????????</h3>
          <div className="login__user-notifications-list flex-center">
            { 
              user.notify ? 
               '?????????????????????? ??????' :
               user.notify.map((item, index) => {
                 return (
                   <div>????????????</div>
                 )
               }) 
            }
          </div>
          <NavLink to="/profile/notifications" className="login__user-notifications-more flex-center text-16">???????????????? ?????? ??????????????????????</NavLink>
        </div>
      </div>
      <div className="login__bonus">
        <span className="flex-row sidebar__count text-16">
          <img src={ bonus } alt={ '???????????????? ??????????' } />
          { user.bonusCurrent }
        </span>   
      </div>
      <NavLink to="/profile/main-info" className="login__user-name text-18">{ user.subname + ' ' + user.name }</NavLink>
      <button className="login__user-menu-button popup-button" onClick={ loginUserHandle }>
        <img src={ menuButton } alt="?????????????? ???????? ????????????????????????" />
      </button>
      <div className="login__user-menu popup">
        <ul className="flex-column">
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/main-info' ><img src={ dashboardIcon } alt="?????????????? ????????" /><span>?????????????? ????????</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/bonus' ><img src={ bonusIcon } alt="?????????????????? ????????????????????" /><span>?????????????????? ????????????????????</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/my-courses' ><img src={ learnIcon } alt="?????? ??????????" /><span>?????? ??????????</span></NavLink></li>
          { user.role === 0 ? '' : <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/create-course' ><img src={ createCourseIcon } alt="?????????????? ????????" /><span>?????????????? ????????</span></NavLink></li> }
          { user.role === 0 ? '' : <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/directions' ><img src={ directionsIcon } alt="?????????????????????? ????????????????" /><span>?????????????????????? ????????????????</span></NavLink></li> }
          { user.role === 2 ? <li className="sidebar__item"><NavLink className="sidebar__link flex-row" to='/profile/users' ><img src={ usersIcon } alt="?????? ????????????????????????" /><span>?????? ????????????????????????</span></NavLink></li> : '' }
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/feedback' ><img src={ feedbackIcon } alt="???????????????? ??????????" /><span>???????????????? ??????????</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/notifications' ><img src={ notificationsIcon } alt="??????????????????????" /><span>??????????????????????</span></NavLink></li>
          <li className="sidebar__item"><NavLink className="sidebar__link text-16 flex-row" to='/profile/settings' ><img src={ settingsIcon } alt="?????????????????? ??????????????" /><span>?????????????????? ??????????????</span></NavLink></li>
          <li className="sidebar__item"><a className="sidebar__link text-16 flex-row" onClick={ exitHandler }><img src={ logoutIcon } alt="??????????" /><span>??????????</span></a></li>
        </ul>
      </div>
    </div>
  )
}

export default Header
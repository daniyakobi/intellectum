import React, { useContext, useState, useEffect, useCallback } from 'react'
import {Switch, Route, Redirect, NavLink} from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context'
import {useHttp} from '../../hooks/http.hook'
import MainInfo from './components/MainInfo'
import Settings from './components/Settings'
import Bonus from './components/Bonus'
import Feedback from './components/Feedback'
import MyCourses from './components/MyCourses'
import Sidebar from '../Default/Sidebar'
import CreateCourse from '../CreateCourse/CreateCourse'
import Notify from './components/Notify'
import Directions from './components/Directions'
import Users from './components/Users'
import UserDetail from './components/UserDetail'
import './Profile.css'

const Profile = (userId) => {
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

  return(
    <div className="profile flex-row-start">
      <div className="profile__info info">
        { !loading && <h1 className="profile__title main-title page-title animate__animated animate__fadeInDown">Мой профиль</h1> }
        { !loading && user && <div className="sidebar animate__animated animate__fadeInLeft"><Sidebar user={user} /></div> }
        { !loading && user && <Route path="/profile/main-info"><MainInfo user={user} /></Route> }
        { !loading && user && <Route path="/profile/bonus"><Bonus user={user} /></Route> }
        { !loading && user && <Route path="/profile/my-courses"><MyCourses user={user} /></Route> }
        { !loading && user && <Route path="/profile/create-course"><CreateCourse user={user} /></Route> }
        { !loading && user && <Route path="/profile/directions"><Directions user={user} /></Route> }
        { !loading && user && <Route path="/profile/users/:id"><UserDetail /></Route> }
        { !loading && user && <Route path="/profile/users" exact><Users user={user} /></Route> }
        { !loading && user && <Route path="/profile/feedback"><Feedback user={user} /></Route> }
        { !loading && user && <Route path="/profile/notifications"><Notify user={user} /></Route> }
        { !loading && user && <Route path="/profile/settings"><Settings user={user} /></Route> }
      </div>
    </div>
  )
}

export default Profile
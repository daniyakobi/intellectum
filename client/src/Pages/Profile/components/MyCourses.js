import React, {useEffect, useState, useContext, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'
import CourseList from './CourseList'
import CourseListLearn from './CourseListLearn'

const MyCourses = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState(candidate)
  const [created, setCreated] = useState([])
  const [current, setCurrent] = useState([])
  const [completed, setCompleted] = useState([])
  const [directions, setDirections] = useState([])

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

  const fetchCreated =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/course/my-created-courses', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setCreated(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchCurrent =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/course/my-current-courses', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setCurrent(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchCompleted =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/course/my-completed-courses', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setCompleted(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )
  
  const fetchDirections =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-directions', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setDirections(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    getUser()
    fetchDirections()
    fetchCurrent()
    fetchCompleted()
    fetchCreated()
  }, [getUser, fetchDirections, fetchCurrent, fetchCompleted, fetchCreated])


  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Мои курсы</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <div className="flex-row info__courses-buttons">
          <NavLink to="/all-courses" className="button flex-center full text-16">Каталог курсов</NavLink>
          { 
            user.role === 0 ? 
              <></> : 
              <NavLink to="/profile/create-course" className="button flex-center full text-16">Создать курс</NavLink>
          }
        </div>
        <div className="info__courses-items">
          <div className="info__line"></div>
          <div className="info__section-title flex-row">
            <span className="text-16">Текущие курсы</span>
          </div>
          <div className="info__courses-wrapper">
            { !loading && <CourseListLearn courses={current} directions={directions} /> }
          </div>
        </div>
        <div className="info__courses-items">
          <div className="info__line"></div>
          <div className="info__section-title flex-row">
            <span className="text-16">Завершенные курсы</span>
          </div>
          <div className="info__courses-wrapper">
            { !loading && <CourseListLearn courses={completed} directions={directions} /> }
          </div>
        </div>
        {
          user.role === 0 ? <></> : 
            <div className="info__courses-items">
              <div className="info__line"></div>
              <div className="info__section-title flex-row">
                <span className="text-16">Созданные курсы</span>
              </div>
              <div className="info__courses-wrapper">
                { !loading && <CourseList courses={created} directions={directions} /> }
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default MyCourses
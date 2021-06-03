import React, {useEffect, useState, useContext, useCallback, useReducer} from 'react'
import { NavLink, useParams, useHistory  } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import { Player, ControlBar, ReplayControl, ForwardControl, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import "../../../../node_modules/video-react/dist/video-react.css";
import backIcon from '../../../img/sidebar/src/backspace.svg'
import reducerLesson from './messages/Reducers/reducerLesson'
import Button from '../../Default/Button'
import Select from '../../Default/Select'
import LearnSidebarItem from './LearnSidebarItem'
import LearnItem from './LearnItem'
import LearnInfo from './LearnInfo'
import defaultImage from '../../../img/defaultCourse.png'

const CourseItemDetail = ({ course }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [users, setUsers] = useState([])
  const [professions, setProfessions] = useState([])
  const [directions, setDirections] = useState([])
  const [modules, setModules] = useState([])
  const courseId = useParams().id
  const [state, dispatch] = useReducer(reducerLesson, {
    lesson: null
  })

  const onLesson = (lesson) => {
    dispatch({
      type: 'SET_LESSON',
      payload: lesson
    })
    console.log(state);
  }

  let thumb = ''
  if(course.thumb) {
    thumb = `http://localhost:3000${course.thumb}`
  } else {
    thumb = defaultImage
  }

  const fetchDirections =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-directions', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setDirections(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchProfessions =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/professions', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setProfessions(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchModules =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/get-modules', 'GET', null, { Authorization: `Bearer ${auth.token}`, courseId: courseId  })
        setModules(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )
  
  useEffect(() => {
    fetchDirections()
    fetchProfessions()
    fetchModules()
  }, [fetchDirections, fetchProfessions, fetchModules])

  const tabsHandler = (event) => {
    const tab = event.target.getAttribute('data-tab')
    const buttons = document.querySelectorAll('.info__detail-button')
    buttons.forEach((item, index) => {
      item.classList.remove('full')
    })
    const tabs = document.querySelectorAll('.info__detail-tab')
    tabs.forEach((item, index) => {
      if(item.dataset.tab === tab) {
        item.classList.toggle('active')
        event.target.classList.add('full')
      } else {
        item.classList.remove('active')
      }
    })
  }

  return(
    <>
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">{ course.name }</h2>
      <div className="info__section animate__animated animate__fadeIn flex-row" style={{height: '100%'}}>
        <NavLink className="info__section__link flex-row text-16" to='/profile/my-courses' ><img src={ backIcon } alt="Мои курсы" /><span>К курсам</span></NavLink>
        <div className="info__detail-buttons flex-row-start">
          <button className='info__detail-button button flex-center full text-16' onClick={ tabsHandler } data-tab='learn' >Прохождение</button>
          <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='info' >Информация</button>
        </div>
      </div>
      <div className="info__section flex-row-start animate__animated animate__fadeIn" style={{height: '100%'}}>
        <div className="learn__tab info__detail-tab animate__animated animate__fadeIn flex-column active" data-tab='learn'>
          <div className="flex-row-start learn__block-wrapper" style={{ width: '100%', height: 500 }}>
            <div className="learn__block">
              {
                !loading && state.lesson ? <LearnItem video={ state.lesson.video } /> : <div className="learn__block-bg"></div>
              }
            </div>
            <div className="learn__sidebar accordion">
            {
              modules.map((item, index) => {
              return(
                <>
                  { item.lessons.length > 0 ? <LearnSidebarItem onLesson={onLesson} module={item} key={index} /> : null }
                </>
              )
              })
            }
            </div>
          </div>
          <div className="info__line"></div>
          { !loading && state.lesson ? <LearnInfo lesson={ state.lesson }/> : null }
        </div>
        <div className="learn__tab info__detail-tab animate__animated animate__fadeIn flex-row-start" data-tab='info'>
        <div className="info__avatar course__thumb">
            <img src={ thumb } alt={ course.name } />
          </div>
          <div className="course__right flex-column" style={{marginLeft: 0}, {width: '100%'}}>
            <div className="flex-row info__item text-16" style={{marginBottom: 0}}>
              { directions.map((dir, index) => {
                if(dir._id === course.direction) {
                  return( <span className='course-item__direction' key={ index }>{ dir.name }</span> )
                }
              }) }
            </div>
            <div className="info__line"></div>
            <div className="info__item text-16">
              <div className="info__label" style={{marginBottom: 10}}>Описание</div>
              <div className="info__value">{ course.description }</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseItemDetail
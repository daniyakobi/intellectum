import React, {useEffect, useState, useContext, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import settingsIcon from '../../../img/sidebar/src/settings.svg'
import Button from '../../Default/Button'

const CourseListLearn = ({ courses, directions }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  if(!courses.length) {
    return(
      <div>У вас нет курсов в данном разделе</div>
    )
  }

  return(
    <>
      {
        courses.map((item, index) => {
          const thumb = `http://localhost:3000${item.thumb}`
          return(
            <div className="course-item flex-column animate__animated animate__fadeIn" key={index}>
              <Link to={`/profile/my-courses/learn/${item._id}`} className='course-item__link'></Link>
              <div className="course-item__thumb">
                <img src={ thumb } alt={ item.name } />
              </div>
              <div className="course-item__detail">
                { directions.map((dir, index) => {
                  if(dir._id === item.direction) {
                    return( <span className='course-item__direction' key={ index }>{ dir.name }</span> )
                  }
                }) }
                <h3 className="course-item__title text-24">{ item.name }</h3>
                <div className="info__line"></div>
                { item.price ?
                  <div className="course-item__price flex-row">
                    <span className="course-item__price-value text-20">{ item.price } <span className="course-item__price-wallet text-16">Руб.</span></span>
                  </div> : null
                }
              </div>
            </div>
          )
        })
      }
    </>
  )
}

export default CourseListLearn
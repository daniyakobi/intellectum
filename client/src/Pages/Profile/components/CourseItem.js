import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import CourseItemDetail from './CourseItemDetail'

const CourseItem = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [course, setCourse] = useState()
  const courseId = useParams().id

  const getCourse = useCallback(async () => {
    try {
      const fetched = await request(`/api/course/${courseId}`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setCourse(fetched)
    } catch (error) {}
  }, [auth.token, courseId, request])

  useEffect(() => {
    getCourse()
  }, [getCourse])

  if(loading) {
    console.log('Загрузка')
  }  

  return(
    <div className="info__wrapper">
      { !loading && course && <CourseItemDetail course={course} /> }
    </div>
  )
}

export default CourseItem
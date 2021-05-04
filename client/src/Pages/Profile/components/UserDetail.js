import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import UserDetailCard from './UserDetailCard'

const UserDetail = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState()
  const userId = useParams().id

  const getUser = useCallback(async () => {
    try {
      const fetched = await request(`/api/profile/users/${userId}`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(fetched)
    } catch (error) {}
  }, [auth.token, userId, request])

  useEffect(() => {
    getUser()
  }, [getUser])

  if(loading) {
    console.log('Загрузка')
  }  

  return(
    <div className="info__wrapper">
      { !loading && user && <UserDetailCard user={user} /> }
    </div>
  )
}

export default UserDetail
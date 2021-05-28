import React, {useEffect, useState, useContext, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import UsersItems from './UsersItems'
import Button from '../../Default/Button'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'

const Users = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState(candidate)
  const [users, setUsers] = useState([])

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

  const fetchUsers =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-users', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setUsers(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    getUser()
    fetchUsers()
  }, [getUser, fetchUsers])

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Все пользователи</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        <div className="info__users">
          { !loading ? <UsersItems users={users} /> : 'Загрузка...' }
        </div>
      </div>
    </div>
  )
}

export default Users
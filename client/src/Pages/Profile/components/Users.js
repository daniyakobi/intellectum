import React, {useEffect, useState, useContext, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import UsersItems from './UsersItems'
import Button from '../../Default/Button'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'

const Users = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [users, setUsers] = useState([])

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
    fetchUsers()
  }, [fetchUsers])

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
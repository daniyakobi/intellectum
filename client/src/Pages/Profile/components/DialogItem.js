import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import defaultAvatar from '../../../img/default.png'

const DialogItemCard = ({dialogId, candidateId}) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [companion, setCompanion] = useState()
  const [user, setUser] = useState()
  const [currUser, setCurrUser] = useState()
  const [count, setCount] = useState()

  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await request(`/api/profile/get-party`, 'GET', null, { Authorization: `Bearer ${auth.token}`, dialogId: dialogId })
      setUser(fetchedUsers)
    } catch (error) {}
  }, [auth.token, request])

  const fetchUnread = useCallback(async () => {
    try {
      const fetchedUnread = await request(`/api/profile/get-unread`, 'GET', null, { Authorization: `Bearer ${auth.token}`, dialogId: dialogId })
      setCount(fetchedUnread)
    } catch (error) {}
  }, [auth.token, request])

  useEffect(() => {
    fetchUsers()
    fetchUnread()
  }, [fetchUsers, fetchUnread])

  return(
    <>
      { !loading  && user && 
        <>
          <div className="chat__dialogs-item-avatar">
            <img src={ user.avatarUrl ? `http://localhost:3000${user.avatarUrl}` : defaultAvatar } alt={ `${user.subname} ${user.name}` } />
            <div className={ `chat__dialog-item-online ${ user.online ? 'online' : 'not-online' }` }></div>
          </div>
          <div className="chat__dialogs-item-content flex-column">
            <p className="text-16">{user.subname} {user.name}</p>
            <p className={ `${user.role === 0 ? 'student' : user.role === 1 ? 'teacher' : 'admin'} text-13` }>
              { user.role === 0 ? 'Студент' : user.role === 1 ? 'Преподаватель' : 'Администратор'}
            </p>
          </div>
          {count != 0 ? <div className="chat__dialogs-item-count text-12 flex-center">{ count }</div> : null}
        </>
      }
    </>
  )
}

export default DialogItemCard
import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import defaultAvatar from '../../../img/default.png'

const NewDialogItem = ({ companion, userId }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  let avatar = ''
  if(companion.avatarUrl) {
    avatar = `http://localhost:3000${companion.avatarUrl}`
  } else {
    avatar = defaultAvatar
  }

  const newDialogHandler = async e => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/create-dialog', 'POST', { users: [userId, companion._id] }, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (error) {}
  }

  return(
    <div className="chat__dialogs-item flex-row-left animate__animated animate__fadeIn" onClick={ newDialogHandler }>
      <div className="chat__dialogs-item-avatar">
        <img src={ avatar } alt={ `${companion.subname} ${companion.name}` } />
        <div className={ `chat__dialog-item-online ${ companion.online ? 'online' : 'not-online' }` }></div>
      </div>
      <div className="chat__dialogs-item-content flex-column">
        <p className="text-16">{companion.subname} {companion.name}</p>
        <p className={ `${companion.role === 0 ? 'student' : companion.role === 1 ? 'teacher' : 'admin'} text-13` }>
          { companion.role === 0 ? 'Студент' : companion.role === 1 ? 'Преподаватель' : 'Администратор'}
        </p>
      </div>
    </div>
  )
}

export default NewDialogItem
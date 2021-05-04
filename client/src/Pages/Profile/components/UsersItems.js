import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import settingsIcon from '../../../img/sidebar/src/settings.svg'
import Button from '../../Default/Button'

const UsersItems = ({ users }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  if(!users.length) {
    return(
      <div>Пользователей нет</div>
    )
  }
  return(
    <>
      {
        users.map((item, index) => {
          return(
            <div className="info__users-item animate__animated animate__fadeIn" key={index}>
              <div className="info__users-row flex-row" key={ index }>
                <div className="text-18" style={{width: 25}}>{ index + 1 }.</div>
                <div className="info__users-name text-18">{ item.subname } { item.name } {item.patronymic}</div>
                <div className="info__users-role text-18">{ item.role === 0 ? 'Студент' : item.role === 1 ? 'Преподаватель' : 'Администратор' }</div>
                <div className='info__users-button'>
                  <Link to={`/profile/users/${item._id}`}><img src={ settingsIcon } alt="Редактировать"/></Link>
                </div>
              </div>
            </div>
          )
        })
      }
    </>
  )
}

export default UsersItems
import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import DirectionsItems from './DirectionsItems'
import Button from '../../Default/Button'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'

const Users = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [users, setUsers] = useState([])

  useEffect(() => {
  }, [])

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Все пользователи</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        
      </div>
    </div>
  )
}

export default Users
import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import Button from '../../../Default/Button'


const NewForm = ({ fetchedRooms, candidate, onOpen, addRoomHandler, onMessages }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    roomName: '', roomPassword: ''
  })

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const newRoomHandler = async () => {
    try {
      const data = await request('/api/chat/new-room', 'POST', {...form}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      const inputs = document.querySelectorAll('.form__input')
      inputs.forEach(item => item.value = '')
      fetchedRooms()
      const roomId = data.room._id
      const messages = await request(`/api/chat/get-messages/${roomId}`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
      onOpen(data.room, form.roomName, candidate._id)
      onMessages(messages)
      addRoomHandler()
    } catch (e) {}
  }


  return(
    <div className="chat__rooms-form flex-column-center">
      <div className="info__section-title flex-row"><span className="text-18">Создание комнаты</span></div>
      <div className="form__group flex-column">
        <input type="text" id="roomName" className="form__input text-17 validate" placeholder="Введите название комнаты" name="roomName" onChange={ changeHandler } />
      </div>
      <div className="form__group flex-column">
        <input type="password" id="roomPassword" className="form__input text-17 validate" placeholder="Введите пароль" name="roomPassword" onChange={ changeHandler } />
      </div>
      <Button class={ ' form__button full text-16' } name={ 'Создать' } handler={ newRoomHandler } disabled={loading} />
    </div>
  )
}

export default NewForm
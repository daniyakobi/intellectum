import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'


const RoomsItem = ({room, onOpen, onMessages, candidateId }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  const connectHandler = async () => {
    try {
      const data = await request('/api/chat/connect-room', 'POST', { roomName: room.name, roomPassword: room.password }, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      const inputs = document.querySelectorAll('.form__input')
      inputs.forEach(item => item.value = '')
      const roomId = data.room._id
      const messages = await request(`/api/chat/get-messages/${roomId}`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
      onOpen(data.room, room.name, candidateId)
      onMessages(messages)
    } catch (e) {}
  }

  return(
    <button className="chat__rooms-item flex-column-left" onClick={ connectHandler }>
      <span className="text-16">{room.name}</span>
      <span className="flex-row text-13" >
        Создатель:<span className={ room.role == 1 ? 'teacher' : 'admin' } style={{ marginLeft:5  }}>{room.creator}</span>
      </span>
    </button>
  )
}

export default RoomsItem
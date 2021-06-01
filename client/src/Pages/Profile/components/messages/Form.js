import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import socket from '../../../../socket'

import sendIcon from '../../../../img/sidebar/src/send-black.svg'

const Form = ({ candidate, roomName }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [messageText, setMessageText] = useState('')

  const sendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      userId: candidate._id,
      text: messageText,
      roomName: roomName
    })
  }

  return(
    <div className="chat__messages-input">
      <input className="text-16" type="text" id='messageText' placeholder="Ваше сообщение" onChange={ (event) => { setMessageText(event.target.value) }} />
      <button className="flex-center chat__messages-send" onClick={ sendMessage }><img src={ sendIcon } alt='Отправить сообщение' /></button>
    </div>
  )
}

export default Form
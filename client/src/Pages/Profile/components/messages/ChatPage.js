import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import ChatBody from './ChatBody'

const ChatPage = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  return(
    <div className="info__wrapper chat">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Сообщения</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        <ChatBody candidate={ candidate } />
      </div>
    </div>
  )
}

export default ChatPage
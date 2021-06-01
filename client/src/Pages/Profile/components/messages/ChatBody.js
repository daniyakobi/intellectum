import React, {useContext, useReducer, useEffect, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'
import axios from 'axios'


import reducerRoom from './Reducers/reducerRoom'
import socket from '../../../../socket'
import Rooms from './Rooms'
import Messages from './Messages'

const ChatBody = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [state, dispatch] = useReducer(reducerRoom, {
    room: null,
    messages: []
  })

  const onOpen = (room, roomName, userId) => {
    dispatch({
      type: 'IS_ROOM',
      payload: room
    })
    socket.emit('ROOM:CONNECT', { roomName, userId })
  }

  const onMessages = (messages) => {
    dispatch({
      type: 'SET_MESSAGES',
      payload: messages
    })
  }

  useEffect(async () => {
    socket.on('ROOM:CONNECTED', users => {
      dispatch({
        type: 'SET_USERS',
        payload: users
      })
    })
    socket.on('ROOM:NEW_MESSAGE', messages => {
      dispatch({
        type: 'SET_MESSAGES',
        payload: messages
      })
    })
    socket.on('ROOM:LEAVE', users => {
      dispatch({
        type: 'SET_USERS',
        payload: users
      })
    })
  }, [])

  return(
    <div className="chat__body flex-row-start">
      <div className="chat__body-rooms">
        <Rooms candidate={ candidate } onOpen={ onOpen } onMessages={ onMessages } />
      </div>
      <div className="chat__body-messages">
        { state.room && <Messages candidate={ candidate } room={ state.room } users={ state.users } messages={ state.messages } /> }
      </div>
    </div>
  )
}

export default ChatBody
import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import Message from './Message'

const MessagesList = ({ candidate, messages }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  return(
    <>
      { 
        messages.map((item, index) => {
          return <Message item={ item } key={ index } />
        })
      }
    </>
  )
}

export default MessagesList
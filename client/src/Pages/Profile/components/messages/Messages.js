import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import Form from './Form'
import MessagesList from './MessagesList'

import deleteIcon from '../../../../img/sidebar/src/delete-dialog.svg'
import groupIcon from '../../../../img/sidebar/src/groups.svg'

const Messages = ({ candidate, room, users, messages }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [searchValue, setSearchValue] = useState('')

  return(
    <div className="chat__messages flex-column animate__animated animate__fadeIn">
      <div className="chat__messages-bar flex-column">
        <div className="chat__messages-title flex-row">
          <h2 className="text-18 animate__animated animate__fadeInRight">{ room.name }</h2>
          <div className="chat__messages-bar-buttons flex-row">
            <button className="flex-center"><img src={ groupIcon } alt='Посмотреть участников' style={{ marginRight: 10 }} /></button>
            <button className="flex-center"><img src={ deleteIcon } alt='Покинуть комнату' /></button>
          </div>
        </div>
        <div className='info__line'></div>
        <div className='chat__messages-search'>
          <div className="form__input-group flex-column">
            <input type="text" id="searchMessage" className="form__input info__settings-input text-17" placeholder='Поиск по сообщениям' name="searchMessage" onChange={ (event) => { setSearchValue(event.target.value) }} />
          </div>
        </div>
      </div>
      <div className="chat__messages-list">
        <MessagesList messages={ messages } />
      </div>
      <Form candidate={ candidate } roomName={ room.name } />
    </div>
  )
}

export default Messages
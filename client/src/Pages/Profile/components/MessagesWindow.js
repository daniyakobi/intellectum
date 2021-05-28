import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import axios from 'axios'
import searchIcon from '../../../img/sidebar/src/search.svg'
import sendIcon from '../../../img/sidebar/src/send-black.svg'
import deleteIcon from '../../../img/sidebar/src/delete-dialog.svg'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'

const MessagesWindow = ({ from, to, dialogId, candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [messages, setMessages] = useState()
  const [searchValue, setSearchValue] = useState('')
  const [messageText, setMessageText] = useState('')
  const [currUser, setCurrUser] = useState()
  const candidateId = candidate._id
  let file
  const imgHandler = event => {
    file = event.target.files[0]
  }

  const fetchMessages = useCallback(async () => {
    try {
      const fetchedMessages = await request('/api/profile/get-messages', 'GET', null, { Authorization: `Bearer ${auth.token}`, dialogId: dialogId})
      setMessages(fetchedMessages)
    } catch (error) {}
  }, [auth.token, request])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessageHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('messageText', messageText)
      formData.append('fromId', from._id)
      formData.append('toId', to._id)
      formData.append('dialogId', dialogId)
      formData.append('token', `Bearer ${auth.token}`)
      if(file) {
        formData.append('messageFile', file)
      }
      axios({
        method: "post",
        url: "/api/profile/send-message",
        data: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      })
      .then(function (result) { fetchMessages() }, 
      function (error) {
        message(error)
      });
      const input = document.querySelector('#messageText').value = ''
      const fileInput = document.querySelector('#messageFile').value = ''
    } catch (error) {}
  }

  return(
    <>
      <div className="chat__window-header flex-row">
        <div className="chat__window-to-name text-18 animate__animated animate__fadeInRight">{ to.subname } { to.name }</div>
        <div className="chat__window-settings flex-row">
          <button className="flex-center"><img src={ searchIcon } alt='Поиск по сообщениям' /></button>
          <button className="flex-center" onClick={ fetchMessages }><img src={ refreshIcon } alt='Обновить' /></button>
          <button className="flex-center"><img src={ deleteIcon } alt='Удалить диалог' /></button>
        </div>
      </div>
      <div className="info__line"></div>
      <div className="chat__window-list animate__animated animate__fadeIn">
        <div className="chat__window-items">
          {
            !loading && messages &&
              messages.map((item, index) => {
                return (
                  <div className={ `chat__window-item flex-row-start ${ item.from === candidateId ? 'right-element' : 'left-element' }` }>
                    <div className="chat__window-item-avatar">
                      <img src={ `http://localhost:3000${ item.from === candidateId ? from.avatarUrl : to.avatarUrl }`  } />
                    </div>
                    <div className="flex-column chat__window-item-content">
                      <p className={ `chat__window-item-name text-13 ${ item.from === candidateId ? from.role === 0 ? 'student' : from.role === 1 ? 'teacher' : 'admin' : to.role === 0 ? 'student' : to.role === 1 ? 'teacher' : 'admin' }` }>
                        { item.from === candidateId ? from.name : to.name }
                        </p>
                      <div className="info__line"></div>
                      <p className="chat__window-item-text text-16">{ item.message }</p>
                    </div>
                  </div>
                )
              })
          }
          {/* <div className="chat__window-item right-element">1</div>
          <div className="chat__window-item left-element">2</div> */}
        </div>
        <div className="chat__window-input">
          <input className="text-16" type="text" id='messageText' placeholder="Ваше сообщение" onChange={ (event) => { setMessageText(event.target.value) }} />
          <div className="chat__window-file"><input type='file' name='messageFile' id='messageFile' onChange={ imgHandler } /></div>
          <button className="flex-center chat__window-send" onClick={ sendMessageHandler }><img src={ sendIcon } alt='Отправить сообщение' /></button>
        </div>
      </div>
    </>
  )
}

export default MessagesWindow
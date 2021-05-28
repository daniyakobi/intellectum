import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import NewDialogItem from './NewDialogItem'
import DialogItem from './DialogItem'
import Messages from './Messages'
import addIcon from '../../../img/sidebar/src/add-dialog.svg'
import replyIcon from '../../../img/sidebar/src/reply.svg'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'


const Chat = ({ candidate, socket }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState(candidate)
  const [searchValue, setSearchValue] = useState('')
  const [addDialog, setAddDialog] = useState(false)
  const [users, setUsers] = useState([])
  const [dialog, setDialog] = useState()
  const [dialogs, setDialogs] = useState([])

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

  const fetchUsers = useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-users', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setUsers(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchDialogs =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-dialogs', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setDialogs(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    getUser()
    fetchUsers()
    fetchDialogs()
  }, [getUser, fetchUsers, fetchDialogs])

  const newDialogShow = (e) => {
    setAddDialog(!addDialog)
  }

  const searchUsersHandler = users.filter((user) => {
    return user.subname.toLowerCase().includes(searchValue.toLowerCase()) 
        || user.name.toLowerCase().includes(searchValue.toLowerCase())  
  })
  
  let dialogId = ''
  const openDialogHandler = useCallback(
    async (e) => {
      e.preventDefault()
      const dialogItems = document.querySelectorAll('.chat__dialogs-item')
      dialogItems.forEach(item => item.classList.remove('open'))
      setDialog(null)
      dialogId = e.target.dataset.dialog
      e.target.parentElement.classList.add('open')
      try {
        const fetched = await request(`/api/profile/get-dialog`, 'GET', null, { Authorization: `Bearer ${auth.token}`, dialogId: dialogId })
        setDialog(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  return(
    <div className="info__wrapper chat">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Сообщения</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        <div className="chat__body flex-row-start">
          <div className="chat__body-dialogs chat__dialogs">
            <div className="form__input-group flex-column chat__dialogs-search" style={{position: 'relative'}}>
              <input type="text" id="search" className="form__input info__settings-input text-17 validate" placeholder={ addDialog ? 'Поиск по пользователям' : 'Поиск по диалогам'} name="search" onChange={ (event) => { setSearchValue(event.target.value) }} />
              <button className="chat__dialogs-update flex-center" onClick={ addDialog ? fetchUsers : fetchDialogs }>
                <img src={ refreshIcon } alt='Обновить' />
              </button>
            </div>
            <div className="info__line"></div>
            <div className="chat__dialogs-list">
              {
                !loading && addDialog ? 
                  searchUsersHandler.map( (item, index) => {
                    if(user._id !== item._id) {
                      return (
                        <NewDialogItem key={ index } companion={item} userId={user._id} />
                      )
                    }
                  })
                :
                  dialogs.map( (item, index) => {
                    return (
                      <div className="chat__dialogs-item flex-row-left animate__animated animate__fadeIn" key={ index } >
                        <DialogItem dialogId={ item._id } candidateId={candidate._id} />
                        <button className="chat__dialogs-open" data-dialog={ item._id } type='submit' onClick={ openDialogHandler } ></button>
                      </div>
                    )
                  })
              }
            </div>

            <button className="chat__dialog-new flex-center" onClick={ newDialogShow }>
              <div className="flex-row">
                <img src={ addDialog ? replyIcon : addIcon } alt={ 'Новый диалог' } />
                <span className="text-16">{ addDialog ? 'К диалогам' : 'Новый диалог' }</span>
              </div>
            </button>
          </div>
          <div className="chat__body-messages chat__messages flex-column">
            {
              !loading && dialog ? <Messages dialog={dialog} candidate={candidate} /> : <div className="chat__messages-none"></div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
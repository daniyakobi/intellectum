import React, {useEffect, useState, useContext, useReducer, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import RoomsList from './RoomsList'
import NewRoom from './NewRoom'
import ConnectForm from './ConnectForm'
import reducerRoom from './Reducers/reducerRoom'

import addIcon from '../../../../img/sidebar/src/group-add.svg'
import replyIcon from '../../../../img/sidebar/src/reply.svg'
import connectIcon from '../../../../img/sidebar/src/add.svg'

const Rooms = ({ onOpen, candidate, onMessages }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [searchValue, setSearchValue] = useState('')
  const [connectRoom, setConnectRoom] = useState(false)
  const [state, dispatch] = useReducer(reducerRoom, {
    addRoom: false,
    connectRoom: false
  })
  const [rooms, setRooms] = useState()

  const addRoomHandler = () => {
    dispatch({
      type: 'IS_ADD',
      payload: !state.addRoom
    })
  }

  const connectRoomHandler = () => {
    dispatch({
      type: 'IS_CONNECT_TO_ROOM',
      payload: !state.connectRoom
    })
  }

  const fetchedRooms =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/chat/get-rooms', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setRooms(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    fetchedRooms()
  }, [fetchedRooms])

  let searchHandler
  if(rooms) {
    searchHandler = rooms.filter((room) => {
      return room.name.toLowerCase().includes(searchValue.toLowerCase()) 
    })
  }
  
  return(
    <div className="chat__rooms flex-column animate__animated animate__fadeIn">
      <div className="chat__rooms-bar flex-column">
        <div className="chat__rooms-title flex-row">
          <h2 className="text-18">Мои комнаты</h2>
          { candidate.role !== 0 ? 
              <button className="chat__rooms-add" onClick={ () => { addRoomHandler() } } >
                <img src={ state.addRoom ? replyIcon : addIcon } alt='Создать комнату' />
              </button>
            : null
          }
        </div>
        <div className='info__line'></div>
        <div className='chat__rooms-search'>
          <div className="form__input-group flex-column">
            <input type="text" id="searchRoom" className="form__input info__settings-input text-17" placeholder='Поиск по комнатам' name="searchRoom" onChange={ (event) => { setSearchValue(event.target.value) }} />
          </div>
        </div>
      </div>
      <div className="chat__rooms-list flex-column">
        {
          state.addRoom ? 
            <NewRoom onMessages={ onMessages } onOpen={ onOpen } fetchedRooms={ fetchedRooms } candidate={ candidate } addRoomHandler={ addRoomHandler } /> 
          : rooms && ( state.connectRoom ? 
            <ConnectForm onMessages={ onMessages } onOpen={ onOpen } fetchedRooms={ fetchedRooms } candidate={ candidate } connectRoomHandler={ connectRoomHandler } /> 
            : <RoomsList onMessages={ onMessages } onOpen={ onOpen } rooms={ searchHandler } candidate={ candidate } /> )    
        }
        {
          state.addRoom ? null : 
            <button className="chat__room-connect flex-center animate__animated animate__fadeInBottom" >
              <div className="flex-row" onClick={ () => { connectRoomHandler() } }>
                <img src={ state.connectRoom ? replyIcon : connectIcon } alt={ 'Новая комната' } />
                <span className="text-16">{ state.connectRoom ? 'Назад' : 'Подключиться к комнате' }</span>
              </div>
            </button>
        }
      </div>
    </div>
  )
}

export default Rooms
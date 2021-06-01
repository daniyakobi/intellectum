import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../../hooks/http.hook'
import { useMessage } from '../../../../hooks/message.hook'
import { AuthContext } from '../../../../context/auth.context'

import RoomItem from './RoomItem'

const RoomsList = ({ rooms, candidate, onOpen }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()

  return(
    <>
      {
        rooms.map( (item, index) => {
          return (
            <RoomItem room={ item } key={ index } onOpen={ onOpen } candidateId={ candidate._id } />
          )
        })
      }
    </>
  )
}

export default RoomsList
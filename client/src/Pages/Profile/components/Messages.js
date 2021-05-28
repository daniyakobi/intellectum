import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import MessagesWindow from './MessagesWindow'

const Messages = ({ dialog, candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [to, setTo] = useState()
  const [searchValue, setSearchValue] = useState('')

  const fetchCompanion = useCallback(async () => {
    try {
      const fetchedCompanion = await request(`/api/profile/get-party`, 'GET', null, { Authorization: `Bearer ${auth.token}`, dialogId: dialog._id })
      setTo(fetchedCompanion)
    } catch (error) {}
  }, [auth.token, request])

  useEffect(() => {
    fetchCompanion()
  }, [fetchCompanion])

  return(
    <div className="chat__messages-window chat__window">
      { !loading && candidate && to && <MessagesWindow from={ candidate } to={ to } dialogId={ dialog._id } candidate={ candidate } /> }
    </div>
  )
}

export default Messages
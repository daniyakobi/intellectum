import React, {useEffect, useState, useContext, useCallback} from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import ProgramItem from './ProgramItem'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'
import './../../Default/Accordion.css'

const CreateModule = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const courseId = useParams().id
  const [modules, setModules] = useState([])

  const fetchModules = useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/get-modules', 'GET', null, { Authorization: `Bearer ${auth.token}`, courseId: courseId })
        setModules(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  return(
    <div className="course__program-accordion">
      <button type="submit" className="course__program-update" onClick={ fetchModules }>
        <img src={ refreshIcon } alt={ 'Обновить' } />
      </button>
      <div className="accordion">
        {
          modules.length == 0 ? 'В курсе еще нет модулей' :
          modules.map((item, index) => {
            return(
              <ProgramItem module={item} key={index} />
            )
          })
        }
      </div>
    </div>
  )
}

export default CreateModule
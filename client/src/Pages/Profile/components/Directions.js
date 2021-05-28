import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import DirectionsItems from './DirectionsItems'
import Button from '../../Default/Button'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'

const Directions = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState(candidate)
  const [directions, setDirections] = useState([])
  const [direction, setDirection] = useState({ direction: '' })

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

  const newDirectionChange = event => {
    setDirection({ direction, direction: event.target.value})
  }

  const newDirectionHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/create-direction', 'POST', direction, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchDirections()
    } catch (error) {}
  }

  const fetchDirections =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-directions', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setDirections(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    getUser()
    fetchDirections()
  }, [getUser, fetchDirections])

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Направления обучения</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        <div className="info__directions">
          <h3 className="info__directions-title text-18">Создать направление</h3>
          <div className="form__input-group flex-column course__direction" style={{marginBottom: 10}}>
            <div className="flex-row course__direction-group">
              <input type="text" id="newDirection" className="form__input info__settings-input text-17 validate" placeholder="Введите новое направление" name="newDirection" onChange={ newDirectionChange } />
              <Button class={ 'course__direction-button form__button full text-16 ' } name={ 'Добавить' } type={ 'submit' } handler={ newDirectionHandler } disabled={loading} />
            </div>
            <span className="form__error helper-text text-14" data-error="Направление не может быть пустым"></span>
          </div>
          <div className="info__line"></div>
          <div className="flex-row">
            <h3 className="info__directions-title text-18">Все направления</h3>
            <button type="submit" className="info__direction-update" onClick={ fetchDirections }>
              <img src={ refreshIcon } alt={ 'Обновить' } />
            </button>
          </div>
          { !loading ? <DirectionsItems directions={directions} /> : 'Загрузка...' }
        </div>
      </div>
    </div>
  )
}

export default Directions
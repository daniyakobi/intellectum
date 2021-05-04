import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Button from '../../Default/Button'

const DirectionsItems = ({ directions }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [direction, setDirection] = useState({name: ''})
  const [directionChange, setDirectionChange] = useState({name: '', newName: ''})

  if(!directions.length) {
    return(
      <div>Направлений нет</div>
    )
  }

  // const newDirectionChange = event => {
  //   setDirectionChange({ newName: event.target.value })
  // }

  const directionHandler = async () => {
    const data = await request('/api/profile/update-direction', 'POST', directionChange, { Authorization: `Bearer ${auth.token}` })
    message(data.message)
  }
  
  const showChangeDirection = (event) => {
    const directionsAll = document.querySelectorAll('.info__directions-name .course__direction')
    directionsAll.forEach((item, index) =>{
      if(item.dataset.value === event.target.value) {
        item.classList.toggle('hide')
      } else {
        item.classList.add('hide')
      }
    })
  } 

  return(
    <>
      {
        directions.map((item, index) => {
          return(
            <div className="info__directions-row flex-row-start" key={ index } >
              <div className="info__directions-name flex-column">
                <span className="text-18 flex-row">
                  <div style={{width: 25}}>{ index + 1 }.</div> 
                  <div>{ item.name }</div>
                </span>
                <div className="form__input-group flex-column course__direction hide animate__animated animate__fadeIn" data-value={ item.name } >
                  <div className="flex-row course__direction-group">
                    <input type="text" id={`newDirection-${index+1}`} className="form__input info__settings-input text-17 validate" placeholder="Введите новое направление" name="newDirection" onChange={ (e) => { setDirectionChange({ name: item.name, newName: e.target.value }) } } />
                    <Button class={ 'course__direction-button form__button full text-16 ' } name={ 'Изменить' } type={ 'submit' } handler={ directionHandler } disabled={loading} />
                  </div>
                  <span className="form__error helper-text text-14" data-error="Направление не может быть пустым"></span>
              </div>
              </div>
              <div className="info__directions-buttons flex-row">
                <div className="info__directions-group info__directions-group--change">
                  <input type="submit" className="info__directions-button info__directions-change" onClick={ showChangeDirection } value={ item.name } />
                </div>
                <div className="info__directions-group info__directions-group--remove">
                  <input className="info__directions-button info__directions-remove" type="submit" value={ item.name } onClick={ async (e) => {
                    try {
                      e.preventDefault()
                      await setDirection({name:e.target.value})
                      console.log(direction)
                      if(direction.name !== '') {
                        const data = await request('/api/profile/remove-direction', 'POST', direction, { Authorization: `Bearer ${auth.token}` })
                        message(data.message)
                      } else {
                        message('Нажмите повторно для подтверждения')
                      }
                    } catch (err) {}
                  } } />
                </div>
              </div>
            </div>
          )
        })
      }
    </>
  )
}

export default DirectionsItems
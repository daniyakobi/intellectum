import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import editIcon from '../../../img/sidebar/src/edit.svg'
import closeIcon from '../../../img/sidebar/src/close-red.svg'

const DirectionsItems = ({ directions }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [direction, setDirection] = useState({ name: '' })

  if(!directions.length) {
    return(
      <div>Направлений нет</div>
    )
  }

  return(
    <>
      {
        directions.map((item, index) => {
          return(
            <div className="info__directions-row flex-row" key={ index } >
              <div className="info__directions-name">
                <span className="text-18 flex-row">
                  <div style={{width: 25}}>{ index + 1 }.</div> 
                  <div>{ item.name }</div>
                </span>
              </div>
              <div className="info__directions-buttons flex-row">
                <button className="info__directions-button"><img src={ editIcon } alt={ 'Редактировать' } /></button>
                <button className="info__directions-button" type="submit" onClick={ async (e) => {
                  try {
                    setDirection({ name: item.name })
                    const data = await request('/api/profile/remove-direction', 'POST', direction, { Authorization: `Bearer ${auth.token}` })
                    message(data.message)
                  } catch (err) {}
                } } ><img src={ closeIcon } alt={ 'Удалить' } /></button>
              </div>
            </div>
          )
        })
      }
    </>
  )
}

export default DirectionsItems
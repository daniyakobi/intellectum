import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import giftImage from '../../../img/gift.png'

const Bonus = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const [user, setUser] = useState(candidate)
  const {loading, error, request, clearError} = useHttp()

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

  useEffect(() => {
    getUser()
  }, [getUser])

  return(
    <div className="info__wrapper">
        <div className="info__section flex-row-start animate__animated animate__fadeIn">
          <h2 className="info__title text-24 animate__animated animate__fadeInRight">Программа лояльности</h2>
          <div className="flex-column info__bonus info__progress"> 
            <div className="info__progress-item flex-column">
              <span className="text-13">Мои бонусные рубли</span>
              <span className="text-title info__progress-value">{ user.bonusCurrent }</span>
            </div>
            <div className="info__progress-item flex-column">
              <span className="text-13">Всего потрачено</span>
              <span className="text-title info__progress-value">{ user.bonusSell }</span>
            </div>
            <div className="info__progress-item flex-column">
              <span className="text-13">Всего заработано</span>
              <span className="text-title info__progress-value">{ user.bonusAll }</span>
            </div>
          </div>
          <div class="info__section-image animate__animated animate__fadeIn">
            <img src={ giftImage } alt='Бонусная программа' />
          </div>
        </div>
        <div className="info__section animate__animated animate__fadeIn">
          <h3 className="info__section-title text-16"><span>Для чего нужны бонусные баллы?</span></h3>
          <p className="info__operations-text text-16">Бонусные баллы начисляются за определенные действия на платформе, среди которых - оплата и прохождение курсов. Накопленные баллы можно использовать в качестве скидки на новые курсы. Скидка может достигать 50%.</p>
        </div>
      </div>
  )
}

export default Bonus
import React, { useContext } from 'react'
import { AuthContext } from '../../../context/auth.context'

const Bonus = ({ user }) => {
  return(
    <div className="info__wrapper">
        <h2 className="info__title text-24 animate__animated animate__fadeInRight">Программа лояльности</h2>
        <div className="info__section animate__animated animate__fadeIn">
          <div className="flex-row-start info__bonus info__progress"> 
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
          <div className="info__line"></div>
          <div className="info__operations">
            <h3 className="info__section-title text-16"><span>История операций</span></h3>
            {
              user.operations ? 
               'Вы не совершали никаких операций' :
               user.operations.map((item, index) => {
                 return (
                   <div>Привет</div>
                 )
               }) 
            }
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
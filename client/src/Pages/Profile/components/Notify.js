import React, { useContext } from 'react'
import { AuthContext } from '../../../context/auth.context'

const Notify = ({ user }) => {
  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Уведомления</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        { 
          user.notify ? 
           'Уведомлений нет' :
           user.notify.map((item, index) => {
             return (
               <div>Привет</div>
             )
           }) 
        }
      </div>
    </div>
  )
}

export default Notify
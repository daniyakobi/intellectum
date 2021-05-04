import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../context/auth.context'

const Feedback = ({ user }) => {
  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Мои курсы</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <div className="flex-row info__courses-buttons">
          <NavLink to="/all-courses" className="button flex-center full text-16">Каталог курсов</NavLink>
          { 
            user.role === 0 ? 
              <></> : 
              <NavLink to="/profile/create-course" className="button flex-center full text-16">Создать курс</NavLink>
          }
        </div>
        <div className="info__courses-items">
          <div className="info__line"></div>
          <div className="info__section-title flex-row">
            <span className="text-16">Текущие курсы</span>
          </div>
          { 
            user.currentCourses ? 
             <p>Вы еще не выбрали себе курс</p> :
             user.currentCourses.map((item, index) => {
               return (
                 <div>Привет</div>
               )
             }) 
          }
        </div>
        <div className="info__courses-items">
          <div className="info__line"></div>
          <div className="info__section-title flex-row">
            <span className="text-16">Завершенные курсы</span>
          </div>
          { 
            user.completedCourses ? 
             <p>Вы еще не не прошли ни одного курса</p> :
             user.currentCourses.map((item, index) => {
               return (
                 <div>Привет</div>
               )
             }) 
          }
        </div>
        {
          user.role === 0 ? <></> : 
            <div className="info__courses-items">
              <div className="info__line"></div>
              <div className="info__section-title flex-row">
                <span className="text-16">Созданные курсы</span>
              </div>
              { 
                user.createdCourses ? 
                 <p>Вы еще не создали ни одного курса</p> :
                 user.currentCourses.map((item, index) => {
                   return (
                     <div>Привет</div>
                   )
                 }) 
              }
            </div>
        }
      </div>
    </div>
  )
}

export default Feedback
import React, {useEffect, useState, useContext, useCallback} from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Select from '../../Default/Select'
import backIcon from '../../../img/sidebar/src/backspace.svg'
import defaultAvatar from '../../../img/default.png'
import bonus from '../../../img/bonus.svg'
import Button from '../../Default/Button'

const UserDetailCard = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const userId = useParams().id
  let role 
  if (user.role === 0) {
    role = 'Студент' }
    else if ( user.role === 1 ) {
      role = 'Преподаватель' }
      else { role = 'Администратор' }

  let avatar = ''
  if(user.avatarUrl) {
    avatar = `http://localhost:3000${user.avatarUrl}`
  } else {
    avatar = defaultAvatar
  }

  const tabsHandler = (event) => {
    const tab = event.target.getAttribute('data-tab')
    const buttons = document.querySelectorAll('.info__detail-button')
    buttons.forEach((item, index) => {
      item.classList.remove('full')
    })
    const tabs = document.querySelectorAll('.info__detail-tab')
    tabs.forEach((item, index) => {
      if(item.dataset.tab === tab) {
        item.classList.toggle('active')
        event.target.classList.add('full')
      } else {
        item.classList.remove('active')
      }
    })
  }

  const handleRole = async (event) => {
    const tmp = document.querySelector('.select__input').getAttribute('value')
    try {
      const data = await request('/api/profile/update-role', 'POST', {candidateId: userId, newRole: tmp}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (error) {}
  }

  return(
    <>
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">{ user.subname } { user.name } { user.patronymic }</h2>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        <div className="info__section-row flex-row">
          <NavLink className="info__section__link flex-row text-16" to='/profile/users' ><img src={ backIcon } alt="Все пользователи" /><span>К пользователям</span></NavLink>
        </div>
        <div className="info__line"></div>
        <div className="info__detail flex-row-start">
          <div className="info__avatar">
            <img src={ avatar } alt={`Аватар - ${user.subname} ${user.name} ${user.patronymic}`}className="info__avatar-preview" />
          </div>
          <div className="info__section-rigth flex-column" style={{marginLeft: 0}, {width: '100%'}}>
            <div className="info__detail-buttons flex-row-start">
              <button className='info__detail-button button flex-center full text-16' onClick={ tabsHandler } data-tab='main' >Основное</button>
              <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='contacts' >Контакты</button>
              <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='stat' >Статистика</button>
              <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='settings' >Настройки</button>
            </div>
            <div className="info__line info__line-tabs"></div>
            <div className='info__detail-block'>
              <div className='info__detail-tab active animate__animated animate__fadeIn' data-tab='main'>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Должность</div>
                  <div className="info__value">{ role }</div>
                </div>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Дата рождения</div>
                  <div className="info__value">{ user.date ? user.date : 'Не указано'}</div>
                </div>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Страна</div>
                  <div className="info__value">{ user.country ? user.country : 'Не указано' }</div>
                </div>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Город</div>
                  <div className="info__value">{ user.city ? user.city : 'Не указано' }</div>
                </div>
                <div className="info__item text-16">
                  <div className="info__label" style={{marginBottom: 10}}>О пользователе</div>
                  <div className="info__value">{ user.about ? user.about : 'Не указано' }</div>
                </div>
              </div>
              <div className='info__detail-tab animate__animated animate__fadeIn' data-tab='contacts'>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Email</div>
                  <div className="info__value">{ user.email }</div>
                </div>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Телефон</div>
                  <div className="info__value">{ user.phone ? user.phone : 'Не указано' }</div>
                </div>
              </div>
              <div className='info__detail-tab animate__animated animate__fadeIn' data-tab='stat'>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Бонусные рубли</div>
                  <div className="info__value flex-row" style={{justifyContent: 'flex-start', color: 'var(--dark-orange)'}}><img src={ bonus } alt={ 'Бонусные рубли' } style={{marginRight: 10}} /> { user.bonusCurrent }</div>
                </div>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Текущие курсы</div>
                  <div className="info__value">{ user.currentCourses ? user.currentCourses.length : '0' }</div>
                </div>
                <div className="flex-row info__item text-16">
                  <div className="info__label">Пройденные курсы</div>
                  <div className="info__value">{ user.completedCourses ? user.completedCourses.length : '0' }</div>
                </div>
                {
                  user.role === 0 ? ' ' :
                    <div className="flex-row info__item text-16">
                      <div className="info__label">Созданные курсы</div>
                      <div className="info__value">{ user.createdCourses ? user.createdCourses.length : '0' }</div>
                    </div>
                }
              </div>
              <div className='info__detail-tab animate__animated animate__fadeIn' data-tab='settings'>
                <div className="info__section-title flex-row" style={{marginBottom: 10}}>
                  <span className="text-16">Изменить роль пользователя</span>
                </div>
                <div className='info__detail-role flex-row-start'>
                  <Select 
                    classes={'info__detail-select'} 
                    name={'changeRole'} 
                    id={'infoDetailRole'}
                    title={'Выберите новую роль для пользователя'}
                    options={[{name: 'Студент'}, {name: 'Преподаватель'}, {name: 'Администратор'}]}
                    current={ role }
                  />
                  <Button class={ 'info__detail-button form__button full text-16 ' } name={ 'Изменить' } type={ 'submit' } handler={ handleRole } disabled={loading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDetailCard
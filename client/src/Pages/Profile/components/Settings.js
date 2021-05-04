import React, {useEffect, useState, useContext} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Button from '../../Default/Button'

const Settings = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    avatar: '',
    name: '', 
    subname: '', 
    patronymic: '', 
    date: '', 
    country: '', 
    city: '',
    email: '', 
    phone: '',
    about: ''
  })
  const [userTmp, setUserTmp] = useState({
    preview: form.avatar
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const saveHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/settings', 'POST', {...form}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (e) {}
  }

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Настройка профиля</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <form onSubmit={ saveHandler } className="info__settings-form form flex-column">
          <div className="form__block flex-row">
            <div className="form__input-group flex-column">
              <label forhtml='subname' >Фамилия</label>
              <input type="text" id="subname" className="form__input info__settings-input text-17 validate" placeholder={ user.subname ? user.subname : 'Введите фамилию' } name="subname" onChange={ changeHandler } />
            </div>
            <div className="form__input-group flex-column">
              <label forhtml='name' >Имя</label>
              <input type="text" id="name" className="form__input info__settings-input text-17 validate" placeholder={ user.name ? user.name : 'Введите имя' } name="name" onChange={ changeHandler } />
            </div>
            <div className="form__input-group flex-column">
              <label forhtml='patronymic' >Отчество</label>
              <input type="text" id="patronymic" className="form__input info__settings-input text-17 validate" placeholder={ user.patronymic ? user.patronymic : 'Введите отчество' } name="patronymic" onChange={ changeHandler } />
            </div>
          </div>
          <div className="form__block flex-row">      
            <div className="form__input-group flex-column">
              <label forhtml='date' >Дата рождения</label>
              <input type="text" id="date" className="form__input info__settings-input text-17 validate" placeholder={ user.date ? user.date : 'Введите дату рождения' } name="date" onChange={ changeHandler } />
            </div>
            <div className="form__input-group flex-column">
              <label forhtml='country' >Страна</label>
              <input type="text" id="country" className="form__input info__settings-input text-17 validate" placeholder={ user.country ? user.country : 'Введите страну' } name="country" onChange={ changeHandler } />
            </div>
            <div className="form__input-group flex-column">
              <label forhtml='city' >Город</label>
              <input type="text" id="city" className="form__input info__settings-input text-17 validate" placeholder={ user.city ? user.city : 'Введите город' } name="city" onChange={ changeHandler } />
            </div>    
          </div>
          <div className="info__line"></div>
          <div className="form__block flex-row">      
            <div className="form__input-group flex-column">
              <label forhtml='country' >Email</label>
              <input type="email" id="email" className="form__input text-17 validate" placeholder={ user.email ? user.email : 'Введите email' } name="email" onChange={ changeHandler } />
            </div>
            <div className="form__input-group flex-column">
              <label forhtml='phone' >Телефон</label>
              <input type="text" id="phone" className="form__input info__settings-input text-17 validate" placeholder={ user.phone ? user.phone : 'Введите телефон' } name="phone" onChange={ changeHandler } />
            </div>    
          </div>
          <div className="info__line"></div>
          <div className="form__block flex-row">     
            <div className="form__input-group flex-column">
              <label forhtml='about' >О себе</label>
              <textarea id="about" className="form__input info__settings-textarea text-17 validate" placeholder={ user.about ? user.about : 'Напишите о себе' } name="about" onChange={ changeHandler } />
            </div>    
          </div>
          <div className="form__block flex-row">
            <Button class={ 'form__button full text-16' } name={ 'Сохранить' } type={ 'submit' } disabled={loading} />
          </div> 
        </form>
      </div>
    </div>
  )
}

export default Settings
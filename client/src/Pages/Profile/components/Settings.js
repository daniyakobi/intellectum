import React, {useEffect, useState, useContext, useCallback} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Button from '../../Default/Button'
import personalImage from '../../../img/personal-information.png'
import contactsImage from '../../../img/contact-us.png'
import aboutImage from '../../../img/about-me.png'

const Settings = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState(candidate)
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

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

  useEffect(() => {
    getUser()
  }, [getUser])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const saveHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/settings', 'POST', {...form}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      getUser()
      const inputs = document.querySelectorAll('.form__input')
      inputs.forEach(item => item.value = '')
    } catch (e) {}
  }

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Настройка профиля</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <form onSubmit={ saveHandler } className="info__settings-form form flex-column">
          <div className="form__block flex-row-start">
            <div className="flex-column" style={{width: '50%'}}>
              <div className="info__section-title flex-row"><span className="text-20">Персональная информация</span></div>
              <div className="form__input-group flex-column" style={{marginBottom: 10}}>
                <label forhtml='subname' >Фамилия</label>
                <input type="text" id="subname" className="form__input info__settings-input text-17 validate" placeholder={ user.subname ? user.subname : 'Введите фамилию' } name="subname" onChange={ changeHandler } />
              </div>
              <div className="form__input-group flex-column" style={{marginBottom: 10}}>
                <label forhtml='name' >Имя</label>
                <input type="text" id="name" className="form__input info__settings-input text-17 validate" placeholder={ user.name ? user.name : 'Введите имя' } name="name" onChange={ changeHandler } />
              </div>
              <div className="form__input-group flex-column" style={{marginBottom: 10}}>
                <label forhtml='patronymic' >Отчество</label>
                <input type="text" id="patronymic" className="form__input info__settings-input text-17 validate" placeholder={ user.patronymic ? user.patronymic : 'Введите отчество' } name="patronymic" onChange={ changeHandler } />
              </div>
              <div className="form__input-group flex-column">
                <label forhtml='date' >Дата рождения</label>
                <input type="text" id="date" className="form__input info__settings-input text-17 validate" placeholder={ user.date ? user.date : 'Введите дату рождения' } name="date" onChange={ changeHandler } />
              </div>
            </div>
            <div className="info__section-image animate__animated animate__fadeIn">
              <img src={ personalImage } alt='Персональная информация' />
            </div>
          </div>
          <div className="info__line"></div>
          <div className="form__block flex-row-start">   
            <div className="info__section-image animate__animated animate__fadeIn">
              <img src={ contactsImage } alt='Контакты' />
            </div>   
            <div className="flex-column" style={{width: '50%'}}>
              <div className="info__section-title flex-row"><span className="text-20">Мои контакты</span></div>
              <div className="form__input-group flex-column" style={{marginBottom: 10}}>
                <label forhtml='country' >Email</label>
                <input type="email" id="email" className="form__input text-17 validate" placeholder={ user.email ? user.email : 'Введите email' } name="email" onChange={ changeHandler } />
              </div>
              <div className="form__input-group flex-column">
                <label forhtml='phone' >Телефон</label>
                <input type="text" id="phone" className="form__input info__settings-input text-17 validate" placeholder={ user.phone ? user.phone : 'Введите телефон' } name="phone" onChange={ changeHandler } />
              </div>  
            </div>  
          </div>
          <div className="info__line"></div>
          <div className="form__block flex-row-start">     
            <div className="flex-column" style={{width: '50%'}}>
              <div className="info__section-title flex-row"><span className="text-20">Немного обо мне</span></div>
              <div className="form__input-group flex-column" style={{marginBottom: 10}}>
                <label forhtml='country' >Страна</label>
                <input type="text" id="country" className="form__input info__settings-input text-17 validate" placeholder={ user.country ? user.country : 'Введите страну' } name="country" onChange={ changeHandler } />
              </div>
              <div className="form__input-group flex-column" style={{marginBottom: 10}}>
                <label forhtml='city' >Город</label>
                <input type="text" id="city" className="form__input info__settings-input text-17 validate" placeholder={ user.city ? user.city : 'Введите город' } name="city" onChange={ changeHandler } />
              </div>   
              <div className="form__input-group flex-column">
                <label forhtml='about' >О себе</label>
                <textarea id="about" className="form__input info__settings-textarea text-17 validate" placeholder={ user.about ? user.about : 'Напишите о себе' } name="about" onChange={ changeHandler } />
              </div>    
            </div>
            <div className="info__section-image animate__animated animate__fadeIn">
              <img src={ aboutImage } alt='Обо мне' />
            </div> 
          </div>
          <div className="form__block flex-row" style={{marginTop: 10}}>
            <Button class={ 'form__button full text-16' } name={ 'Сохранить' } type={ 'submit' } disabled={loading} />
          </div> 
        </form>
      </div>
    </div>
  )
}

export default Settings
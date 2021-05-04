import React, {useEffect, useState} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import Button from '../Default/Button'
import {NavLink} from 'react-router-dom'
import './Auth.css'

const Register = () => {
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    name: '', email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  return(
    <div className="auth">
      <div className="auth__form form flex-column animate__animated animate__fadeIn"> 
        <h2 className="form__title text-24">Регистрация</h2>
        <div>
          <div className="form__group flex-column">
            <input type="text" id="name" required="true" className="form__input text-17 validate" placeholder="Введите имя" name="name" onChange={ changeHandler } require />
            <span className="form__error helper-text text-14" data-error="Введите имя"></span>
          </div>
          <div className="form__group flex-column">
            <input type="email" id="email" required="true" className="form__input text-17 validate" placeholder="Введите Email" name="email" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Введите email"></span>
          </div>
          <div className="form__group flex-column" style={{marginBottom: 0}}>
            <input type="password" id="password" required="true" className="form__input text-17 validate" placeholder="Введите пароль" name="password" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Введите пароль"></span>
          </div>
        </div>
        <div className="form__buttons flex-row">
          <Button class={ ' form__button full text-16' } name={ 'Регистрация' } handler={ registerHandler } disabled={loading} />
          <NavLink to="/login" className='button flex-center form__button text-16'>Войти</NavLink>
        </div>
        <span className="form__footer text-13">Регистрируясь в сервисе, принимаю условия <a href="/">соглашения</a> и <a href="/">политики конфиденциальности</a></span>
      </div>
    </div>
  )
}

export default Register
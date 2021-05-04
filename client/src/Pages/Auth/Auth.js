import React, {useEffect, useState, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context'
import Button from '../Default/Button'
import './Auth.css'

const Auth = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const authHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      message(data.message)
      auth.login(data.token, data.userId)
    } catch (e) {}
  }

  return(
    <div className="auth">
      <div className="auth__form form flex-column animate__animated animate__fadeIn"> 
        <h2 className="form__title text-24">Авторизация</h2>
        <div>
          <div className="form__group flex-column">
            <input type="email" id="email" required="true" className="form__input text-17 validate" placeholder="Введите Email" name="email" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Введите email"></span>
          </div>
          <div className="form__group flex-column">
            <input type="password" id="password" required="true" className="form__input text-17 validate" placeholder="Введите пароль" name="password" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Введите пароль"></span>
          </div>
          <div className="form__group flex-row-right" style={{marginBottom: 0}}>
            <NavLink to="/reset" className='form__reset-link text-16'>Забыли пароль?</NavLink>
          </div>
        </div>
        <div className="form__buttons flex-row">
          <Button class={ ' form__button full text-16' } name={ 'Войти' } handler={ authHandler } disabled={loading} />
          <NavLink to="/register" className='button flex-center form__button text-16'>Регистрация</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Auth
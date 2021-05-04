import React, {useEffect, useState, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context'
import Button from '../Default/Button'
import './Auth.css'

const Password = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    password: '',
    passwordSec: '',
    tokenReset: window.location.pathname.split('/')[2]
  })
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const authHandler = async () => {
    console.log({...form});
    try {
      const data = await request('/api/auth/password', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  return(
    <div className="auth">
      <div className="auth__form form flex-column animate__animated animate__fadeIn"> 
        <h2 className="form__title text-24">Задайте новый пароль</h2>
        <div>
          <div className="form__group flex-column">
            <input type="password" id="password" minLength="6" required="true" className="form__input text-17 validate" placeholder="Введите новый пароль" name="password" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Введите пароль"></span>
          </div>
          <div className="form__group flex-column" style={{marginBottom: 0}}>
            <input type="password" id="passwordSec" required="true" minLength="6" className="form__input text-17 validate" placeholder="Повторите пароль" name="passwordSec" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Повторите пароль"></span>
          </div>
        </div>
        <div className="form__buttons flex-row">
          <Button class={ ' form__button full text-16' } name={ 'Восстановить' } handler={ authHandler } disabled={loading} />
          <NavLink to="/login" className='button flex-center form__button text-16'>Войти</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Password
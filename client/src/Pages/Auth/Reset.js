import React, {useEffect, useState, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context'
import Button from '../Default/Button'
import './Auth.css'

const Reset = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    email: ''
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
      const data = await request('/api/auth/reset', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  return(
    <div className="auth">
      <div className="auth__form form flex-column animate__animated animate__fadeIn"> 
        <h2 className="form__title text-24">Забыли пароль?</h2>
        <div>
          <div className="form__group flex-column" style={{marginBottom: 0}}>
            <input type="email" id="email" required="true" className="form__input text-17 validate" placeholder="Введите Email" name="email" onChange={ changeHandler } />
            <span className="form__error helper-text text-14" data-error="Введите email"></span>
          </div>
        </div>
        <div className="form__buttons flex-row">
          <Button class={ ' form__button full text-16' } name={ 'Сбросить' } handler={ authHandler } disabled={loading} />
          <NavLink to="/login" className='button flex-center form__button text-16'>Назад</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Reset
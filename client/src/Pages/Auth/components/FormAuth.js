import React from 'react'
import back from '../../img/back.svg'
import Button from '../../Default/Button'
import {NavLink} from 'react-router-dom'

export default (props) => {
  return (
    <div className="auth">
      <form className="auth__form flex-column">
        <NavLink to="/about" className="form__back flex-row text-14"><img src={ back } /><span className="text-17">Подробнее о платформе</span></NavLink>
        <h2 className="form__title text-20">Авторизуйтесь по email</h2>
        <input type="email" required className="form__input text-17" placeholder="Введите Email" name="authEmail" />
        <input type="password" required className="form__input text-17" placeholder="Введите пароль" name="authPassword" />
        <div className="form__buttons flex-row">
          <Button class={ ' form__button full text-16' } name={ 'Войти' } />
          <Button class={ ' form__button text-16' } name={ 'Регистрация' } />
        </div>
      </form>
    </div>
  )
}

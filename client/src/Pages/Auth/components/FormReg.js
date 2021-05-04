import React from 'react'
import back from '../../img/back.svg'
import {NavLink} from 'react-router-dom'

export default (props) => {
  return (
    <div className="auth">
      <form className="auth__form flex-column">
        <NavLink to="/about" className="form__back flex-row"><img src={ back } /><span className="text-17">Подробнее о платформе</span></NavLink>
        <h2 className="form__title text-20">Регистрация</h2>
        <input type="text" required className="form__input text-17" placeholder="Введите имя" name="authName" />
        <input type="email" required className="form__input text-17" placeholder="Введите Email" name="authEmail" />
        <input type="password" required className="form__input text-17" placeholder="Введите пароль" name="authPassword" />
        <input type="password" required className="form__input text-17" placeholder="Повторите пароль" name="authSecondPassword" />
        <div className="form__buttons flex-row">
          <NavLink to="/register" className='button flex-center form__button full text-16'>Регистрация</NavLink>
          <NavLink to="/auth" className='button flex-center form__button text-16'>Войти</NavLink>
        </div>
        <span className="form__footer text-13">Регистрируясь в сервисе, принимаю условия <a href="/">соглашения</a> и <a href="/">политики конфиденциальности</a></span>
      </form>
    </div>
  )
}

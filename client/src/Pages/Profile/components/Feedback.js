import React, {useEffect, useState, useContext, useRef} from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Button from '../../Default/Button'

const Feedback = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    email: user.email,
    name: user.name, 
    title: '', 
    text: '' 
  })

  
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const feedbackHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/feedback', 'POST', {...form}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (e) {}
  }

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Обратная связь</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <p className="info__operations-text text-16">Напишите нам, если у вас остались вопросы. Не забудьте указать как нам с вами связаться.</p>
        <div className="info__line"></div>
        <form onSubmit={ feedbackHandler } className="info__settings-form form flex-column">
          <div className="form__block flex-row">
            <div className="form__input-group flex-column">
              <label forhtml='title' >Тема сообщения</label>
              <input type="text" id="title" className="form__input info__settings-input text-17 validate" required="true" placeholder="Укажите тему сообщения" name="title" onChange={ changeHandler } />
              <span className="form__error helper-text text-14" data-error="Тема сообщения не может быть пустой"></span>
            </div>
          </div>
          <div className="form__block flex-row">     
            <div className="form__input-group flex-column">
              <label forhtml='text' >Текст сообщения</label>
              <textarea id="text" className="form__input info__settings-textarea text-17 validate" required="true" placeholder="Ваше сообщение" name="text" onChange={ changeHandler }b/>
              <span className="form__error helper-text text-14" data-error="Сообщение не может быть пустым"></span>
            </div>    
          </div>
          <div className="form__block flex-row">
            <Button class={ 'form__button full text-16' } name={ 'Отправить' } type={ 'submit' } disabled={loading} />
          </div> 
        </form>
      </div>
    </div>
  )
}

export default Feedback
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import edit from '../../../img/edit.svg'
import defaultAvatar from '../../../img/profile-image.png'
import progressImage from '../../../img/progress-indicator.png'
import axios from 'axios'

const MainInfo = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const [user, setUser] = useState(candidate)
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    avatar: ''
  })
  const [userTmp, setUserTmp] = useState({
    preview: user.avatarUrl
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

  let avatar = ''
  if(user.avatarUrl) {
    avatar = `http://localhost:3000${user.avatarUrl}`
  } else {
    avatar = defaultAvatar
  }
  
  const uploadFile = (file) => {
    if(!['image/jpeg','image/png','image/jpg'].includes(file.type)) {
      message('Разрешены изображения следующих форматов - jpeg, png, jpg')
      return
    }
    if(file.size > 5 * 1024 * 1024) {
      message('Файл должен быть менее 5 Мб. Размер вашего файла = ' + file.size)
      return
    }
  }

  let file

  const imgHandler = event => {
    file = event.target.files[0]
    uploadFile(file)
    setUserTmp({preview: URL.createObjectURL(file)})
    setForm({avatar: event.target.files[0]})
    document.querySelector('.info__avatar-submit').classList.add('show')
  }

  const saveHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('token', `Bearer ${auth.token}`)
      if (form.avatar instanceof File) {
        formData.append('avatar', form.avatar)
      }
      axios(
        {
          method: "post",
          url: "/api/profile/avatar",
          data: formData,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        })
        .then(function (result) {
          message('Аватар успешно загружен')
        }, function (error) {
          message(error)
        });
      document.querySelector('.info__avatar-submit').classList.remove('show')
      getUser()
    } catch (e) {}
  }

  return(
    <div className="info__wrapper">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Рабочий стол</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <div className="info__section-title flex-row">
          <span className="text-16">Основная информация</span>
          <NavLink to="/profile/settings"><img src={ edit } alt={ 'Редактировать' } /></NavLink>
        </div>
        <div className="flex-row-start">
         <div className="info__avatar">
           <form onSubmit={ saveHandler } className="info__avatar-form" encType="multipart/form-data">
            <div className='info__avatar-img'>
              <input type='file' id='avatar' name='avatar' onChange={ imgHandler } />
            </div>
            <input type='submit' value="Сохранить" className='info__avatar-submit form__button full text-16 button flex-center animate__animated animate__fadeInUp' />
           </form>
           <img src={ userTmp.preview ? userTmp.preview : avatar } alt="Мой аватар" id="formAvatarView" className="info__avatar-preview" />
         </div>
         <div className="flex-column" style={{marginLeft: 0}, {width: '100%'}}>
           <h3 className="info__name text-24">{ user.subname + ' ' + user.name + ' ' + user.patronymic }</h3>
           <div className="info__line"></div>
           <div className="flex-row info__item text-16">
             <div className="info__label">Должность</div>
             <div className="info__value">{ user.role === 0 ? 'Студент' : user.role === 1 ? 'Преподаватель' : 'Администратор' }</div>
           </div>
           <div className="flex-row info__item text-16">
             <div className="info__label">Дата рождения</div>
             <div className="info__value">{ user.date ? user.date : 'Укажите в настройках профиля'}</div>
           </div>
           <div className="flex-row info__item text-16">
             <div className="info__label">Страна</div>
             <div className="info__value">{ user.country ? user.country : 'Укажите в настройках профиля' }</div>
           </div>
           <div className="flex-row info__item text-16">
             <div className="info__label">Город</div>
             <div className="info__value">{ user.city ? user.city : 'Укажите в настройках профиля' }</div>
           </div>
           <div className="info__item text-16">
             <div className="info__label" style={{marginBottom: 10}}>Обо мне</div>
             <div className="info__value">{ user.about ? user.about : 'Напишите о себе в настройках профиля' }</div>
           </div>
         </div>
        </div>
        <div className="info__line"></div>
        <div className="info__section-title flex-row">
          <span className="text-16">Контакты</span>
          <NavLink to="/profile/settings"><img src={ edit } alt={ 'Редактировать' } /></NavLink>
        </div>
        <div className="flex-сolumn">
          <div className="flex-row info__item text-16">
            <div className="info__label">Email</div>
            <div className="info__value">{ user.email }</div>
          </div>
          <div className="flex-row info__item text-16">
            <div className="info__label">Телефон</div>
            <div className="info__value">{ user.phone ? user.phone : 'Укажите в настройках профиля' }</div>
          </div>
        </div>
      </div>
      <div className="info__section flex-row-start animate__animated animate__fadeIn">
        <div className="info__progress flex-column">
          <h3 className="info__name text-24">Общий прогресс</h3>
          <div className="info__progress-item flex-column">
            <span className="text-13">Бонусные рубли</span>
            <span className="text-title info__progress-value">{ user.bonusCurrent }</span>
          </div>
          <div className="info__progress-item flex-column">
            <span className="text-13">Пройденные курсы</span>
            <span className="text-title info__progress-value">{ user.completedCourses ? user.completedCourses.length : '0' }</span>
          </div>
          <div className="info__progress-item flex-column">
            <span className="text-13">Текущие курсы</span>
            <span className="text-title info__progress-value">{ user.currentCourses ? user.currentCourses.length : '0' }</span>
          </div>
          {
            user.role === 0 ? ' ' :
              <div className="info__progress-item flex-column">
                <span className="text-13">Созданные курсы</span>
                <span className="text-title info__progress-value">{ user.createdCourses ? user.createdCourses.length : '0' }</span>
              </div>
          }
        </div>
        <div className="info__section-image animate__animated animate__fadeIn">
          <img src={ progressImage } alt='Мой прогресс' />
        </div>
      </div>
    </div> 
  )
}

export default withRouter(MainInfo)
import React, {useEffect, useState, useContext, useCallback} from 'react'
import { NavLink, useParams, useHistory  } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import CreateModule from './CreateModule'
import CreateLesson from './CreateLesson'
import Program from './Program'
import axios from 'axios'
import backIcon from '../../../img/sidebar/src/backspace.svg'
import Button from '../../Default/Button'
import Select from '../../Default/Select'
import defaultImage from '../../../img/defaultCourse.png'

const CourseItemDetail = ({ course }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [directions, setDirections] = useState([])
  const courseId = useParams().id
  const [form, setForm] = useState({
    name: '', 
    description: '', 
    price: '',
    thumb: ''
  })
  const [courseImg, setCourseImg] = useState({
    preview: ''
  })
  const [users, setUsers] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [professions, setProfessions] = useState([])
  const [profession, setProfession] =  useState({ newProfession: '', newDescription: '', direction: '' })
  const [deleteProfession, setDeleteProfession] =  useState({ deleteProfession: '' })
  const [deleteCourse, setDeleteCourse] =  useState({ deleteCourse: '', courseId: '' })
  const history = useHistory()
  let thumb = ''
  if(course.thumb) {
    thumb = `http://localhost:3000${course.thumb}`
  } else {
    thumb = defaultImage
  }

  const fetchDirections =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-directions', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setDirections(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchUsers =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/all-students', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setUsers(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchProfessions =  useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/professions', 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setProfessions(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )
  
  useEffect(() => {
    fetchDirections()
    fetchUsers()
    fetchProfessions()
  }, [fetchDirections, fetchUsers, fetchProfessions])

  const tabsHandler = (event) => {
    const tab = event.target.getAttribute('data-tab')
    const buttons = document.querySelectorAll('.info__detail-button')
    buttons.forEach((item, index) => {
      item.classList.remove('full')
    })
    const tabs = document.querySelectorAll('.info__detail-tab')
    tabs.forEach((item, index) => {
      if(item.dataset.tab === tab) {
        item.classList.toggle('active')
        event.target.classList.add('full')
      } else {
        item.classList.remove('active')
      }
    })
  }

  const createTabsHandler = (event) => {
    const tab = event.target.getAttribute('data-tab')
    const buttons = document.querySelectorAll('.course__create-button')
    buttons.forEach((item, index) => {
      item.classList.remove('full')
    })
    const tabs = document.querySelectorAll('.course__create-tab')
    tabs.forEach((item, index) => {
      if(item.dataset.tab === tab) {
        item.classList.toggle('active')
        event.target.classList.add('full')
      } else {
        item.classList.remove('active')
      }
    })
  }

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
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
    setCourseImg({preview: URL.createObjectURL(file)})
    setForm({thumb: event.target.files[0]})
  }

  const saveHandler = async (e) => {
    e.preventDefault()
    try { 
      const formData = new FormData();
      formData.append('courseId', courseId)
      formData.append('token', `Bearer ${auth.token}`)
      formData.append('name', document.querySelector('#name').value)
      formData.append('description', document.querySelector('#description').value)
      formData.append('price', document.querySelector('#price').value)
      if (form.thumb instanceof File) {
        formData.append('thumb', form.thumb)
      }
      axios(
        {
          method: "post",
          url: "/api/profile/update-course",
          data: formData,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        })
        .then(function (result) {
          message('Курс обновлен')
        }, function (error) {
          message(error)
        });
    } catch (e) {}
  }

  const searchHandler = users.filter((user) => {
    return user.subname.toLowerCase().includes(searchValue.toLowerCase()) 
        || user.name.toLowerCase().includes(searchValue.toLowerCase())  
        || user.patronymic.toLowerCase().includes(searchValue.toLowerCase())
  })

  let tmp = []
  let first = ''
  const selectProfessionHandler = (professions) => {
    professions.map((item, index) => {
      if(index == 0) { first = item.name }
      tmp[index] = {
        name: item.name
      }
    })
  }

  let tmpDir = []
  let firstDir = ''
  const selectDirectionsHandler = (directions) => {
    directions.map((item, index) => {
      if(index == 0) { firstDir = item.name }
      tmpDir[index] = {
        name: item.name
      }
    })
  }

  const newProfessionHandler = async (e) => {
    e.preventDefault()
    const tmp = document.querySelector('.course__profession-group .select__input').getAttribute('value')
    try {
      const data = await request('/api/profile/create-profession', 'POST', {newProfession: profession.newProfession, newDescription: profession.newDescription, direction: tmp}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchProfessions()
    } catch (error) {}
  }

  const deleteProfessionHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/delete-profession', 'POST', deleteProfession, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchProfessions()
    } catch (error) {}
  }

  const professionHandler = async (e) => {
    e.preventDefault()
    const tmp = document.querySelector('.form__input-professions .select__input').getAttribute('value')
    try {
      const data = await request('/api/profile/add-course-to-profession', 'POST', {courseId: courseId, addProfession: tmp}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchProfessions()
    } catch (error) {}
  }

  const publicatedHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/publicated-course', 'POST', {courseId: courseId}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (error) {}
  }

  const unpublicatedHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/unpublicated-course', 'POST', {courseId: courseId}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (error) {}
  }

  const openCourseHandler = async e => {
    e.preventDefault()
    const candidateId = e.target.dataset.id
    try {
      const data = await request('/api/profile/open-course', 'POST', { userId: candidateId, courseId: courseId }, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchUsers()
    } catch (error) {}
  }

  const closeCourseHandler = async e => {
    e.preventDefault()
    const candidateId = e.target.dataset.id
    try {
      const data = await request('/api/profile/close-course', 'POST', { userId: candidateId, courseId: courseId }, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchUsers()
    } catch (error) {}
  }

  const deleteCourseHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/delete-course', 'POST', deleteCourse, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      if(data.isDelete) history.push("/profile/my-courses")
    } catch (error) {}
  }

  return(
    <>
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">{ course.name }</h2>
      <div className="info__section animate__animated animate__fadeIn flex-row" style={{height: '100%'}}>
        <NavLink className="info__section__link flex-row text-16" to='/profile/my-courses' ><img src={ backIcon } alt="Мои курсы" /><span>К курсам</span></NavLink>
        <div className="info__detail-buttons flex-row-start">
          <button className='info__detail-button button flex-center full text-16' onClick={ tabsHandler } data-tab='main' >Основное</button>
          <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='program' >Программа</button>
          <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='availability' >Доступность</button>
          <button className='info__detail-button button flex-center text-16' onClick={ tabsHandler } data-tab='settings' >Настройки</button>
        </div>
      </div>
      <div className="info__section animate__animated animate__fadeIn" style={{height: '100%'}}>
        <div className="course__detail info__detail-tab animate__animated animate__fadeIn flex-row-start active" data-tab='main'>
          <div className="info__avatar course__thumb">
            <img src={ thumb } alt={ course.name } />
          </div>
          <div className="course__right flex-column" style={{marginLeft: 0}, {width: '100%'}}>
            <div className="flex-row info__item text-16">
              { directions.map((dir, index) => {
                if(dir._id === course.direction) {
                  return( <span className='course-item__direction' key={ index }>{ dir.name }</span> )
                }
              }) }
              {
                course.publication == 0 ? <p className='text-16 red-text'>Не опубликован</p> : <p className='text-16 green-text'>Опубликован</p> 
              }
            </div>
            <div className="course__price text-16">
              <span className="course__price-value text-20">Цена: { course.price }</span> <span className="course__price-wallet text-16">Руб.</span>
            </div>
            <div className="info__line"></div>
            <div className="info__item text-16">
              <div className="info__label" style={{marginBottom: 10}}>Описание</div>
              <div className="info__value">{ course.description }</div>
            </div>
            <div className="info__line"></div>
            {
                course.publication == 0 ? 
                  <Button class={ 'course__publicated-button form__button full text-16' } name={ 'Опубликовать' } type={ 'submit' } handler={ publicatedHandler } disabled={loading} />
                : 
                  <Button class={ 'course__publicated-button form__button full text-16' } name={ 'Снять с публикации' } type={ 'submit' } handler={ unpublicatedHandler } disabled={loading} />
            }
          </div>
        </div>
        <div className="course__detail info__detail-tab animate__animated animate__fadeIn flex-column" data-tab='program'>
          <div className="info__section-title flex-row"><span className="text-16">Создание модулей и уроков</span></div>
          <div className="course__create-buttons flex-row-left">
            <button className='course__create-button button flex-center full text-16' onClick={ createTabsHandler } data-tab='view' >Просмотр</button>
            <button className='course__create-button button flex-center text-16' onClick={ createTabsHandler } data-tab='module' >Настройки модулей</button>
            <button className='course__create-button button flex-center text-16' onClick={ createTabsHandler } data-tab='lesson' >Настройки уроков</button>
            {/* <button className='course__create-button button flex-center text-16' onClick={ createTabsHandler } data-tab='test' >Настройки тестов</button> */}
          </div>
          <div className="info__line"></div>
          <div className="course__detail course__create-tab animate__animated animate__fadeIn flex-column active" data-tab='view'>
            <div className="info__section-title flex-row">
              <span className="text-16">Программа курса</span>
            </div>
            <Program />
          </div>
          <div className="course__detail course__create-tab animate__animated animate__fadeIn flex-column" data-tab='module'>
            <CreateModule />
          </div>
          <div className="course__detail course__create-tab animate__animated animate__fadeIn flex-column" data-tab='lesson'>
            <CreateLesson />
          </div>
          {/* <div className="course__detail course__create-tab animate__animated animate__fadeIn flex-column" data-tab='test'>
            <div className="info__section-title flex-row">
              <span className="text-16">Создание теста</span>
            </div>
          </div> */}
        </div>
        <div className="course__detail info__detail-tab animate__animated animate__fadeIn flex-column" data-tab='availability'>
          <div className="course__detail-search flex-row-start" style={{width: '100%'}}>
            <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
              <input type="text" id="search" className="form__input info__settings-input text-17 validate" placeholder='Введите пользователя' name="search" onChange={ (event) => { setSearchValue(event.target.value) }} />
              <span className="form__error helper-text text-14" data-error="Запрос не может быть пустым"></span>
            </div>
          </div>
          <div className="info__line"></div>
          <div className="course__detail-results">
            {
              searchHandler.map((item, index) => {
                const curr = item.currentCourses
                const result = curr.find(el => el === courseId)
                return(
                  <div className="info__users-item animate__animated animate__fadeIn course__detail-results-item" key={index}>
                    <div className="info__users-row flex-row" >
                      <div className="text-18" style={{width: 25}}>{ index + 1 }.</div>
                      <div className="info__users-name text-18">{ item.subname } { item.name } {item.patronymic}</div>
                      <div className='course__detail-results-buttons info__users-buttons flex-row'>
                        {
                          !result ?
                            <Button class={ 'form__button full text-16' } dataId={ item._id } name={ 'Открыть' } type={ 'submit' } handler={ openCourseHandler } />
                          :
                            <Button class={ 'form__button full text-16' } dataId={ item._id } name={ 'Закрыть' } type={ 'submit' } handler={ closeCourseHandler } />
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="course__detail info__detail-tab animate__animated animate__fadeIn flex-column" data-tab='settings'>
          <div className="info__section-title flex-row">
            <span className="text-16">Настройки основной информации</span>
          </div>
          <div className="form__block course__settings-block">
              <div className="flex-column">
                <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
                  <label forhtml='name' >Название курса</label>
                  <input type="text" id="name" className="form__input info__settings-input text-17 validate" placeholder={ course.name } name="name" onChange={ changeHandler } />
                  <span className="form__error helper-text text-14" data-error="Название курса не может быть пустым"></span>
                </div>
                <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
                  <label forhtml='price' >Цена</label>
                  <input type="number" id="price" className="form__input info__settings-input text-17 validate" placeholder={ course.price + ' руб.' } name="price" onChange={ changeHandler } />
                  <span className="form__error helper-text text-14" data-error="Цена курса не может быть пустой"></span>
                </div> 
              <div className="form__input-group flex-column course__description">
                <label forhtml='description' >Описание</label>
                <textarea id="description" className="form__input info__settings-textarea text-17 validate" placeholder={ course.description } name="description" onChange={ changeHandler } />
                <span className="form__error helper-text text-14" data-error="Описание не может быть пустым"></span>
              </div>   
            </div>
          </div>          
          <div className="info__line"></div>
          <div className="info__section-title flex-row">
            <span className="text-16">Настройка изображения</span>
          </div>
          <div className="form__block course__settings-block" style={{marginBottom:10}}>
            <div className="flex-column">
              <div className="form__input-group form__block-avatar form__block-course-img">
                <div className="form__avatar course__img">
                  <input type='file' id='thumb' name='thumb' onChange={ imgHandler } className='form__input-img' />
                </div>
                <img src={ courseImg.preview ? courseImg.preview : thumb } alt="Изображение курса" id="courseImgView" className="course__img-view" />
              </div>
            </div>
          </div>
          <Button class={ 'form__button full text-16' } name={ 'Сохранить' } type={ 'submit' } handler={ saveHandler } disabled={loading} />
          <div className="info__line"></div>
          <div className="info__section-title flex-row">
            <span className="text-16">Настройки профессий</span>
          </div>
          <div className="form__block course__settings-block">
            <div className="form__input-group" style={{marginBottom: 10}}>
              <label forhtml='professions'>Выберите профессию
                { selectProfessionHandler(professions) }
                  <Select 
                    classes={'form__input-professions form__input-direction'} 
                    name={'professions'} 
                    id={'professions'}
                    title={'Выберите профессию'}
                    options={ tmp }
                    current={ first }
                  />
              </label>
              <Button class={ 'form__button-professions form__button full text-16' } name={ 'Сохранить' } type={ 'submit' } handler={ professionHandler } disabled={loading} />
              <div className="info__line"></div>
              <div className="flex-column course__profession-wrapper">
                <div className="info__section-title flex-row">
                  <span className="text-16">Новая профессия</span>
                </div>
                <div className="form__input-group flex-column course__profession">
                  <div className="course__profession-group flex-column">
                    <input type="text" id="newProfession" className="form__input info__settings-input text-17 validate" placeholder="Введите новую профессию" name="newProfession" onChange={ (e) => setProfession({...profession, 'newProfession': e.target.value }) } style={{marginBottom: 10}} />
                    <label forhtml='direction'>Выберите направление
                      { selectDirectionsHandler(directions) }
                      <Select 
                        classes={'form__input-direction'} 
                        name={'direction'} 
                        id={'direction'}
                        title={'Выберите направление'}
                        options={ tmpDir }
                        current={ firstDir }
                      />
                    </label>
                    <textarea id="newDescription" className="form__input info__settings-textarea text-17 validate" placeholder='Введите описание новой профессии' name="newDescription" onChange={ (e) => setProfession({...profession, 'newDescription': e.target.value })} style={{marginBottom: 10}} />
                    <Button class={ 'course__profession-button form__button full text-16' } name={ 'Добавить' } type={ 'submit' } handler={ newProfessionHandler } disabled={loading} />
                  </div>
                  <span className="form__error helper-text text-14" data-error="Заполните все поля"></span>
                </div>
              </div>
              <div className="info__line"></div>
              <div className="flex-column course__profession-wrapper">
                <div className="info__section-title flex-row">
                  <span className="text-16">Удаление профессии</span>
                </div>
                <div className="form__input-group flex-column course__profession">
                  <div className="course__profession-group flex-row">
                    <input type="text" id="deleteProfession" className="form__input info__settings-input text-17 validate" placeholder="Введите профессию" name="deleteProfession" onChange={ (e) => setDeleteProfession({ 'deleteProfession': e.target.value }) } style={{marginRight: 5, width: '100%'}} />
                    <Button class={ 'course__profession-button form__button full text-16' } name={ 'Удалить' } type={ 'submit' } handler={ deleteProfessionHandler } disabled={loading} />
                  </div>
                  <span className="form__error helper-text text-14" data-error="Заполните все поля"></span>
                </div>
              </div>
            </div>  
          </div>
          <div className="info__line"></div>
          <div className="form__block course__settings-block" style={{marginBottom:10}}>
            <div className="flex-column">
              <div className="info__section-title flex-row">
                <span className="text-16">Удаление курса</span>
              </div>
              <div className="form__input-group flex-column course__profession">
                <div className="course__profession-group flex-row">
                  <input type="text" id="deleteCourse" className="form__input info__settings-input text-17 validate" placeholder="Введите курс для подтверждения" name="deleteCourse" onChange={ (e) => setDeleteCourse({ 'deleteCourse': e.target.value, courseId: courseId}) } style={{marginRight: 5, width: '100%'}} />
                  <Button class={ 'course__profession-button form__button full text-16' } name={ 'Удалить' } type={ 'submit' } handler={ deleteCourseHandler } disabled={loading} />
                </div>
                <span className="form__error helper-text text-14" data-error="Заполните все поля"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseItemDetail
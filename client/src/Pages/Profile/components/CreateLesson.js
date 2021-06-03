import React, {useEffect, useState, useContext, useCallback} from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import { Player, ControlBar, ReplayControl, ForwardControl, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import "../../../../node_modules/video-react/dist/video-react.css";
import axios from 'axios'
import Button from '../../Default/Button'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'
import closeIcon from '../../../img/sidebar/src/close.svg'
import defaultImage from '../../../img/def-lesson.jpg'

const CreateModule = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const courseId = useParams().id
  const [lessonVideo, setLessonVideo] = useState({
    preview: ''
  })
  const [edit, setEdit] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [modules, setModules] = useState([])
  const [lessons, setLessons] = useState([])
  const [lesson, setLesson] = useState()
  const [selectLesson, setSelectLesson] = useState(false)
  const [video, setVideo] = useState('')
  const videoPath = ''

  const fetchModules = useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/get-modules', 'GET', null, { Authorization: `Bearer ${auth.token}`, courseId: courseId })
        setModules(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchLessons = useCallback(
    async () => {
      const moduleId = document.querySelector('#moduleOldNameL').dataset.id
      try {
        const fetched = await request('/api/profile/get-lessons', 'GET', null, { Authorization: `Bearer ${auth.token}`, moduleId: moduleId })
        setLessons(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  const fetchLesson = useCallback(
    async () => {
      const moduleId = document.querySelector('#moduleOldNameL').dataset.id
      const lessonId = document.querySelector('#lessonOldName').dataset.id
      try {
        const fetched = await request('/api/profile/get-lesson', 'GET', null, { Authorization: `Bearer ${auth.token}`, moduleId: moduleId, lessonId: lessonId })
        setLesson(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const newLessonHandler = async (e) => {
    e.preventDefault()
    try {
      const moduleId = document.querySelector('#moduleOldNameL').dataset.id
      if(edit) {
        const name = document.querySelector('#lessonName').value
        const description = document.querySelector('#lessonDescription').value
        const formDataCreate = new FormData();
        formDataCreate.append('courseId', courseId)
        formDataCreate.append('moduleId', moduleId)
        formDataCreate.append('token', `Bearer ${auth.token}`)
        formDataCreate.append('name', name)
        formDataCreate.append('description', description)
        formDataCreate.append('video', video)
        axios({
          method: "post",
          url: "/api/course/create-lesson",
          data: formDataCreate,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        })
        .then(function (result) {
          message('Урок создан')
          fetchLessons()
        }, function (error) {
          message(error)
        });
      } else {
        const name = document.querySelector('#lessonName').value
        const description = document.querySelector('#lessonDescription').value
        const lessonId = document.querySelector('#lessonOldName').dataset.id
        const formDataUpdate = new FormData();
        formDataUpdate.append('courseId', courseId)
        formDataUpdate.append('moduleId', moduleId)
        formDataUpdate.append('lessonId', lessonId)
        formDataUpdate.append('token', `Bearer ${auth.token}`)
        formDataUpdate.append('name', name)
        formDataUpdate.append('description', description)
        formDataUpdate.append('video', video)
        axios({
          method: "post",
          url: "/api/course/update-lesson",
          data: formDataUpdate,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        })
        .then(function (result) {
          message('Урок обновлен')
          fetchLessons()
        }, function (error) {
          message(error)
        });
      }
      fetchModules()
      const inputs = document.querySelectorAll('.course__detail-right .form__input')
      inputs.forEach(item => item.value = '')
      setLessonVideo({preview: ''})
      const videoInput = document.querySelector('#video').value = ''
    } catch (error) {}
  }

  const deleteLessonHandler = async (e) => {
    e.preventDefault()
    try {
      const moduleId = document.querySelector('#moduleOldNameL').dataset.id
      const lessonId = document.querySelector('#lessonOldName').dataset.id
      const data = await request('/api/course/delete-lesson', 'POST', {courseId: courseId, moduleId: moduleId, lessonId: lessonId}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchModules()
      fetchLessons()
      const lessonOldInput = document.querySelector('#lessonOldName')
      lessonOldInput.setAttribute('placeholder', 'Выберите урок из списка')
      lessonOldInput.setAttribute('data-id', '')
    } catch (error) {}
  }

  const searchModuleHandler = modules.filter((module) => {
    return module.name.toLowerCase().includes(searchValue.toLowerCase())
  })

  const searchLessonHandler = lessons.filter((lesson) => {
    return lesson.name.toLowerCase().includes(searchValue.toLowerCase())
  })

  const createHandler = (e) => {
    const lessonNameInput = document.querySelector('#lessonNameInput')
    const deleteButton = document.querySelector('.delete-lesson')
    lessonNameInput.classList.add('hide')
    deleteButton.classList.toggle('hide')
    setEdit(deleteButton.classList.contains('hide'))
    setSelectLesson(false)
    setLesson()
  }

  const selectModuleInput = (e) => {
    const items = document.querySelectorAll('.course__results-item')
    items.forEach((item) => {
      item.classList.remove('select')
    })
    const id = e.target.dataset.id
    const name = e.target.dataset.name
    e.target.classList.add('select')
    const moduleOldInput = document.querySelector('#moduleOldNameL')
    moduleOldInput.setAttribute('placeholder', name)
    moduleOldInput.setAttribute('data-id', id)
    if(!edit) {
      const lessonNameInput = document.querySelector('#lessonNameInput')
      lessonNameInput.classList.remove('hide')
    }
    if(moduleOldInput.getAttribute('data-id') !== '') {
      setSelectLesson(true)
    } else {
      setSelectLesson(false)
    }
    fetchLessons()
  }

  const selectLessonInput = (e) => {
    const items = document.querySelectorAll('.course__results-item')
    items.forEach((item) => {
      item.classList.remove('select')
    })
    const id = e.target.dataset.id
    const name = e.target.dataset.name
    e.target.classList.add('select')
    const lessonOldInput = document.querySelector('#lessonOldName')
    lessonOldInput.setAttribute('placeholder', name)
    lessonOldInput.setAttribute('data-id', id)
    fetchLesson()
  }

  const dischargeHandler = () => {
    const moduleOldInput = document.querySelector('#moduleOldNameL')
    moduleOldInput.setAttribute('placeholder', 'Выберите модуль из списка')
    moduleOldInput.setAttribute('data-id', '')
    const lessonNameInput = document.querySelector('#lessonNameInput')
    lessonNameInput.classList.add('hide')
    setSelectLesson(false)
  }

  const uploadVideo = (file) => {
    if(!['video/mp4', 'video/mov'].includes(file.type)) {
      message('Разрешены изображения следующих форматов - mp4')
      return
    }
  }

  const videoHandler = event => {
    const file = event.target.files[0]
    uploadVideo(file)
    setLessonVideo({preview: URL.createObjectURL(file)})
    setVideo(event.target.files[0])
  }
  
  return(
    <div className="flex-row-start">
      <div className="flex-column course__detail-left">
        <Button class={ 'form__button full text-16' } name={ edit ? 'Редактировать' : 'Создать' } type={ 'submit' } handler={ createHandler } disabled={loading} /> 
        <div className="info__line"></div>
        <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
          <input type="text" id="searchLesson" className="form__input info__settings-input text-17 validate" placeholder={selectLesson ? 'Введите название урока' : 'Введите название модуля'} name="searchModule" onChange={ (event) => { setSearchValue(event.target.value) }} />
          <span className="form__error helper-text text-14" data-error="Запрос не может быть пустым"></span>
        </div>
        <div className="course__results flex-column">
          <div className="course__results-buttons flex-column">
            <button type="submit" className="course__results-update" onClick={ selectLesson ? fetchLessons : fetchModules }>
              <img src={ refreshIcon } alt={ 'Обновить' } />
            </button>
            <button type="submit" className="course__results-remove" onClick={ dischargeHandler }>
              <img src={ closeIcon } alt={ 'Сбросить' } />
            </button>
          </div>
          {
            selectLesson ? 
              searchLessonHandler.map((item, index) => {
                if(item.course === courseId) {
                  return(
                    <div className='course__results-item course__results-lesson animate__animated animate__fadeIn text-16' key={ index } data-name={ item.name } data-id={ item._id } onClick={ selectLessonInput }>
                      { item.name }
                    </div>
                  )
                }
              })
            :
              searchModuleHandler.map((item, index) => {
                if(item.course === courseId) {
                  return(
                    <div className='course__results-item course__results-module animate__animated animate__fadeIn text-16' key={ index } data-name={ item.name } data-id={ item._id } onClick={ selectModuleInput }>
                      { item.name }
                    </div>
                  )
                }
              })
          }
        </div>
      </div>
      <div className="flex-column course__detail-right">
        <div className="form__block course__settings-block">
          <div className="flex-column">
            <div className="info__section-title flex-row"><span className="text-20">{ !edit ? 'Редактировать урок' : 'Создать урок' }</span></div>
            <div className="form__input-group flex-column course__input animate__animated animate__fadeIn" id="moduleNameInputL" style={{marginBottom: 10}}>
              <label forhtml='name' >Модуль для редактирования</label>
              <input type="text" disabled id="moduleOldNameL" className="form__input info__settings-input text-17 validate" placeholder='Выберите модуль из списка' data-id='' name="module" />
              <span className="form__error helper-text text-14" data-error="Название курса не может быть пустым"></span>
            </div>
            <div className="form__input-group flex-column course__input hide animate__animated animate__fadeIn" id="lessonNameInput" style={{marginBottom: 10}}>
              <label forhtml='lesson' >Урок для редактирования</label>
              <input type="text" disabled id="lessonOldName" className="form__input info__settings-input text-17 validate" placeholder='Выберите урок из списка' data-id='' name="lesson"  />
              <span className="form__error helper-text text-14" data-error="Название урока не может быть пустым"></span>
            </div>
            <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
              <label forhtml='name' >Название урока</label>
              <input type="text" id="lessonName" className="form__input info__settings-input text-17 validate" placeholder={ lesson ? lesson.name : 'Введите название урока' } name="name" />
              <span className="form__error helper-text text-14" data-error="Название урока не может быть пустым"></span>
            </div>
            <div className="form__input-group flex-column course__description" style={{marginBottom: 10}}>
              <label forhtml='description' >Описание</label>
              <textarea id="lessonDescription" className="form__input info__settings-textarea text-17 validate" placeholder={ lesson ? lesson.description : 'Введите описание урока' } name="description" />
              <span className="form__error helper-text text-14" data-error="Описание не может быть пустым"></span>
            </div>  
            <div className="form__input-group form__video flex-column" style={{marginBottom: 10}}>
              <label forhtml='video' >Видео</label>
              <div className="form__video-button button flex-center form__button full text-16">
                <span>Загрузить</span>
                <input type='file' id='video' name='video' onChange={ videoHandler } className='form__input-video' />
              </div>
              <div className="form__video-preview">
                {
                  lessonVideo.preview === '' ? 
                    lesson ? 
                      <Player width={'100%'} height={'100%'}>
                        <source src={ `http://localhost:3000${lesson.video}` } />

                        <ControlBar>
                          <ReplayControl seconds={10} order={1.1} />
                          <ForwardControl seconds={10} order={1.2} />
                          <CurrentTimeDisplay order={4.1} />
                          <TimeDivider order={4.2} />
                          <PlaybackRateMenuButton rates={[2, 1, 0.5]} order={7.1} />
                          <VolumeMenuButton vertical />
                        </ControlBar>
                      </Player>
                    :
                      null
                   :
                    <Player width={'100%'} height={'100%'}>
                    <source src={ lessonVideo.preview } />

                    <ControlBar>
                      <ReplayControl seconds={10} order={1.1} />
                      <ForwardControl seconds={10} order={1.2} />
                      <CurrentTimeDisplay order={4.1} />
                      <TimeDivider order={4.2} />
                      <PlaybackRateMenuButton rates={[2, 1, 0.5]} order={7.1} />
                      <VolumeMenuButton vertical />
                    </ControlBar>
                  </Player>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="info__line"></div>
        <div className='flex-row'>
          <Button class={ 'form__button full text-16' } name={ 'Сохранить' } type={ 'submit' } handler={ newLessonHandler } disabled={loading} /> 
          <Button class={ 'form__button full text-16 delete-lesson animate__animated animate__fadeIn' } name={ 'Удалить' } type={ 'submit' } handler={ deleteLessonHandler } disabled={loading} /> 
        </div>
      </div>
    </div>
  )
}

export default CreateModule
import React, {useEffect, useState, useContext, useCallback} from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { AuthContext } from '../../../context/auth.context'
import Button from '../../Default/Button'
import refreshIcon from '../../../img/sidebar/src/refresh.svg'
import closeIcon from '../../../img/sidebar/src/close.svg'

const CreateModule = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const courseId = useParams().id
  const [form, setForm] = useState({
    name: '', 
    description: ''
  })
  const [edit, setEdit] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [modules, setModules] = useState([])

  const fetchModules = useCallback(
    async () => {
      try {
        const fetched = await request('/api/profile/get-modules', 'GET', null, { Authorization: `Bearer ${auth.token}`, courseId: courseId })
        setModules(fetched)
      } catch (error) {}
    },
    [auth.token, request]
  )

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const newModuleHandler = async (e) => {
    e.preventDefault()
    try {
      if(edit) {
        const data = await request('/api/course/create-module', 'POST', {name: form.name, description: form.description, courseId: courseId}, { Authorization: `Bearer ${auth.token}` })
        message(data.message)
      } else {
        const moduleId = document.querySelector('#moduleOldName').dataset.id
        const data = await request('/api/course/update-module', 'POST', {name: form.name, description: form.description, courseId: courseId, moduleId: moduleId}, { Authorization: `Bearer ${auth.token}` })
        message(data.message)
      }
      fetchModules()
      const inputs = document.querySelectorAll('.course__detail-right .form__input')
      inputs.forEach(item => item.value = '')
      const moduleOldInput = document.querySelector('#moduleOldName')
      moduleOldInput.setAttribute('placeholder', 'Выберите модуль из списка')
      moduleOldInput.setAttribute('data-id', '')
    } catch (error) {}
  }

  const deleteModuleHandler = async (e) => {
    e.preventDefault()
    try {
      const moduleId = document.querySelector('#moduleOldName').dataset.id
      const data = await request('/api/course/delete-module', 'POST', {courseId: courseId, moduleId: moduleId}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchModules()
    } catch (error) {}
  }

  const searchHandler = modules.filter((module) => {
    return module.name.toLowerCase().includes(searchValue.toLowerCase())
  })

  const createHandler = (e) => {
    const moduleInput = document.querySelector('#moduleNameInput')
    const deleteButton = document.querySelector('.delete-module')
    moduleInput.classList.toggle('hide')
    deleteButton.classList.toggle('hide')
    setEdit(moduleInput.classList.contains('hide'))
  }

  const selectModule = (e) => {
    const items = document.querySelectorAll('.course__results-item')
    items.forEach((item) => {
      item.classList.remove('select')
    })
    const id = e.target.dataset.id
    const name = e.target.dataset.name
    e.target.classList.add('select')
    const moduleOldInput = document.querySelector('#moduleOldName')
    moduleOldInput.setAttribute('placeholder', name)
    moduleOldInput.setAttribute('data-id', id)
  }

  const dischargeHandler = () => {
    const moduleOldInput = document.querySelector('#moduleOldName')
    moduleOldInput.setAttribute('placeholder', 'Выберите модуль из списка')
    moduleOldInput.setAttribute('data-id', '')
  }
  
  return(
    <div className="flex-row-start">
      <div className="flex-column course__detail-left">
        <Button class={ 'form__button full text-16' } name={ edit ? 'Редактировать' : 'Создать' } type={ 'submit' } handler={ createHandler } disabled={loading} /> 
        <div className="info__line"></div>
        <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
          <input type="text" id="searchModule" className="form__input info__settings-input text-17 validate" placeholder='Введите название модуля' name="searchModule" onChange={ (event) => { setSearchValue(event.target.value) }} />
          <span className="form__error helper-text text-14" data-error="Запрос не может быть пустым"></span>
        </div>
        <div className="course__results flex-column">
          <div className="course__results-buttons flex-column">
            <button type="submit" className="course__results-update" onClick={ fetchModules }>
              <img src={ refreshIcon } alt={ 'Обновить' } />
            </button>
            <button type="submit" className="course__results-remove" onClick={ dischargeHandler }>
              <img src={ closeIcon } alt={ 'Сбросить' } />
            </button>
          </div>
          {
            searchHandler.map((item, index) => {
              if(item.course === courseId) {
                return(
                  <div className='course__results-item animate__animated animate__fadeIn text-16' key={ index } data-name={ item.name } data-id={ item._id } onClick={ selectModule }>
                    { item.name }
                  </div>
                )
              }
            })
          }
        </div>
      </div>
      <div className="flex-column course__detail-right">
        <div className="form__block course__settings-block" style={{marginBottom:10}}>
          <div className="flex-column">
            <div className="info__section-title flex-row"><span className="text-20">{ !edit ? 'Редактировать модуль' : 'Создать модуль' }</span></div>
            <div className="form__input-group flex-column course__input animate__animated animate__fadeIn" id="moduleNameInput" style={{marginBottom: 10}}>
              <label forhtml='name' >Модуль для редактирования</label>
              <input type="text" disabled id="moduleOldName" className="form__input info__settings-input text-17 validate" placeholder='Выберите модуль из списка' data-id='' name="module" onChange={ changeHandler }  />
              <span className="form__error helper-text text-14" data-error="Название курса не может быть пустым"></span>
            </div>
            <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
              <label forhtml='name' >Название модуля</label>
              <input type="text" id="moduleName" className="form__input info__settings-input text-17 validate" placeholder='Введите название модуля' name="name" onChange={ changeHandler } />
              <span className="form__error helper-text text-14" data-error="Название курса не может быть пустым"></span>
            </div>
            <div className="form__input-group flex-column course__description" style={{marginBottom: 10}}>
              <label forhtml='moduleDescription' >Описание</label>
              <textarea id="description" className="form__input info__settings-textarea text-17 validate" placeholder='Введите описание модуля' name="description" onChange={ changeHandler } />
              <span className="form__error helper-text text-14" data-error="Описание не может быть пустым"></span>
            </div>  
          </div>
        </div>
        <div className='flex-row'>
          <Button class={ 'form__button full text-16' } name={ 'Сохранить' } type={ 'submit' } handler={ newModuleHandler } disabled={loading} /> 
          <Button class={ 'form__button full text-16 delete-module animate__animated animate__fadeIn' } name={ 'Удалить' } type={ 'submit' } handler={ deleteModuleHandler } disabled={loading} /> 
        </div>
      </div>
    </div>
  )
}

export default CreateModule
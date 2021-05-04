import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { AuthContext } from '../../context/auth.context'
import Button from '../Default/Button'
import SelectItems from './components/SelectItems'
import defaultImg from '../../img/default-course.png'

const CreateCourse = ({ user }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [form, setForm] = useState({
    name: '', 
    description: '', 
    author: user._id, 
    price: '',
    direction: ''
  })
  const [courseImg, setCourseImg] = useState({
    preview: defaultImg
  })
  const [direction, setDirection] = useState({ direction: '' })
  const [directions, setDirections] = useState([])
  const fileInput = useRef(null)

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const selectHandler = event => {
    setForm({...form, direction: event.target.value})
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

  const imgHandler = event => {
    let reader = new FileReader()
    let file = fileInput.current.files[0]
    uploadFile(file)

    reader.onloadend = () => {
      setCourseImg({preview: reader.result})
      // setForm({...form, avatar: file})
    }
    // setForm(userTmp)
    reader.readAsDataURL(file)
  }

  const saveHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/create-course', 'POST', {...form}, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
    } catch (e) {}
  }

  const newDirectionChange = event => {
    setDirection({ direction, direction: event.target.value })
  }

  const newDirectionHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await request('/api/profile/create-direction', 'POST', direction, { Authorization: `Bearer ${auth.token}` })
      message(data.message)
      fetchDirections()
    } catch (error) {}
  }

  const showNewDirection = (e) => {
    document.querySelector('.course__direction').classList.toggle('show')
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

  useEffect(() => {
    fetchDirections()
  }, [fetchDirections])

  return(
    <div className="info__wrapper course">
      <h2 className="info__title text-24 animate__animated animate__fadeInRight">Создание курса</h2>
      <div className="info__section animate__animated animate__fadeIn">
        <div className="form__block flex-row-start">
          <div className="flex-column" style={{width: '50%'}}>
            <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
              <label forhtml='name' >Название курса</label>
              <input type="text" id="name" className="form__input info__settings-input text-17 validate" placeholder="Введите название курса" name="name" onChange={ changeHandler } />
              <span className="form__error helper-text text-14" data-error="Название курса не может быть пустым"></span>
            </div>
            <div className="form__input-group" style={{marginBottom: 10}}>
              <label forhtml='direction'>Выберите направление
                <select className="form__input info__settings-input text-17" name="direction" id="direction" defaultValue={ directions[0] } onChange={ selectHandler }>
                  { !loading && <SelectItems directions={directions} /> }
                </select>
              </label>
              <div className="flex-column course__direction-wrapper">
                <div className="course__button form__reset-link text-16 flex-row-right" onClick={ showNewDirection }>Добавить направление?</div>
                <div className="form__input-group flex-column course__direction" style={{marginBottom: 10}}>
                  <label forhtml='newDirection' >Новое направление</label>
                  <div className="flex-row course__direction-group">
                    <input type="text" id="newDirection" className="form__input info__settings-input text-17 validate" placeholder="Введите новое направление" name="newDirection" onChange={ newDirectionChange } />
                    <Button class={ 'course__direction-button form__button full text-16' } name={ 'Добавить' } type={ 'submit' } handler={ newDirectionHandler } disabled={loading} />
                  </div>
                  <span className="form__error helper-text text-14" data-error="Направление не может быть пустым"></span>
                </div>
              </div>
            </div>  
            <div className="form__input-group flex-column course__input">
              <label forhtml='price' >Цена</label>
              <input type="number" id="price" className="form__input info__settings-input text-17 validate" placeholder="Введите цену курса в рублях" name="price" onChange={ changeHandler } />
              <span className="form__error helper-text text-14" data-error="Цена курса не может быть пустой"></span>
            </div>  
          </div>  
          <div className="form__block form__block-avatar form__block-course-img flex-row">
            <div className="form__avatar course__img">
              <input type='file' id='courseImg' name='courseImg' ref={ fileInput } onChange={ imgHandler } className='form__input-img' />
            </div>
            <img src={ courseImg.preview ? courseImg.preview : defaultImg } alt="Изображение курса" id="courseImgView" className="course__img-view" />
          </div>    
        </div>
        <div className="info__line"></div>
        <div className="form__block flex-row">     
          <div className="form__input-group flex-column course__description">
            <label forhtml='description' >Описание</label>
            <textarea id="description" className="form__input info__settings-textarea text-17 validate" placeholder="Введите описание" name="description" onChange={ changeHandler }b/>
            <span className="form__error helper-text text-14" data-error="Описание не может быть пустым"></span>
          </div>  
        </div>
        <div className="form__block flex-row">
          <Button class={ 'form__button full text-16' } name={ 'Создать' } type={ 'submit' } handler={ saveHandler } disabled={loading} />
        </div> 
      </div>
    </div>
  )
}

export default CreateCourse
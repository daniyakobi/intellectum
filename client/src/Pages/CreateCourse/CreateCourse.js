import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { AuthContext } from '../../context/auth.context'
import Button from '../Default/Button'
import Select from '../Default/Select'
import defaultImg from '../../img/bg-1.jpeg'
import createCourseImage from '../../img/create.png'
import axios from 'axios'

const CreateCourse = ({ candidate }) => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [user, setUser] = useState(candidate)
  const [form, setForm] = useState({
    name: '', 
    description: '', 
    author: user._id, 
    price: '',
    direction: '',
    thumb: ''
  })
  const [courseImg, setCourseImg] = useState({
    preview: defaultImg
  })
  const [direction, setDirection] = useState({ direction: '' })
  const [directions, setDirections] = useState([])

  const getUser = useCallback(async () => {
    try {
      const data = await request('/api/profile/main', 'GET', null, { Authorization: `Bearer ${auth.token}` })
      setUser(data)
    } catch (e) {}
  }, [auth.token, request])

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
      formData.append('name', document.querySelector('#name').value)
      formData.append('description', document.querySelector('#description').value)
      formData.append('author', user._id)
      formData.append('token', `Bearer ${auth.token}`)
      formData.append('price', document.querySelector('#price').value)
      formData.append('direction', document.querySelector('.select__input').getAttribute('value'))
      if (form.thumb instanceof File) {
        formData.append('thumb', form.thumb)
      }
      axios(
        {
          method: "post",
          url: "/api/profile/create-course",
          data: formData,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        })
        .then(function (result) {
          message('Курс добавлен, переходите к заполнению')
        }, function (error) {
          message(error)
        });
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

  let tmp = []
  let first = ''
  const selectDirectionsHandler = (directions) => {
    directions.map((item, index) => {
      if(index == 0) { first = item.name }
      tmp[index] = {
        name: item.name
      }
    })
  }

  useEffect(() => {
    getUser()
    fetchDirections()
  }, [getUser, fetchDirections])


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
                { selectDirectionsHandler(directions) }
                <Select 
                  classes={'form__input-direction'} 
                  name={'direction'} 
                  id={'direction'}
                  title={'Выберите направление'}
                  options={ tmp }
                  current={ first }
                />
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
            <div className="form__input-group flex-column course__input" style={{marginBottom: 10}}>
              <label forhtml='price' >Цена</label>
              <input type="number" id="price" className="form__input info__settings-input text-17 validate" placeholder="Введите цену курса в рублях" name="price" onChange={ changeHandler } />
              <span className="form__error helper-text text-14" data-error="Цена курса не может быть пустой"></span>
            </div>  
            <div className="form__input-group form__block-avatar form__block-course-img flex-column" style={{marginBottom: 15}}>
              <label forhtml='thumb'>Изображение курса</label>
              <div className="form__avatar course__img">
                <input type='file' id='thumb' name='thumb' onChange={ imgHandler } className='form__input-img' />
              </div>
              <img src={ courseImg.preview ? courseImg.preview : defaultImg } alt="Изображение курса" id="courseImgView" className="course__img-view" />
            </div>  
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
          <div class="info__section-image animate__animated animate__fadeIn">
            <img src={ createCourseImage } alt='Создание курса' />
          </div>  
        </div>
      </div>
    </div>
  )
}

export default CreateCourse
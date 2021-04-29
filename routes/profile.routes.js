const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Direction = require('../models/Direction')
const Course = require('../models/Course')
const router = Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')

// Получить пользователя
router.get(
  '/main',
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401).json({ 'message': 'Пользователь не авторизован' });
        return false;
      }

      const decoded = jwt.verify(token, config.get('jwtsecret'))

      const user = await User.findOne({ _id: decoded.userId })
      res.json(user)
    } catch (e) {
      return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

// Изменить данные пользователя
router.post(
  '/settings',
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]
      if (!token) {
        res.status(401).json({ 'message': 'Пользователь не авторизован' });
        return false;
      }
      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })
      console.log('Avatar',user.avatarUrl)
      console.log(req.file)
      const toChange = {
        avatarUrl: '',
        subname: req.body.subname !== '' ? req.body.subname : user.subname,
        name: req.body.name !== '' ? req.body.name : user.name,
        patronymic: req.body.patronymic !== '' ? req.body.patronymic : user.patronymic,
        date: req.body.date !== '' ? req.body.date : user.date,
        country: req.body.country !== '' ? req.body.country : user.country,
        city: req.body.city !== '' ? req.body.city : user.city,
        email: req.body.email !== '' ? req.body.email : user.email,
        phone: req.body.phone !== '' ? req.body.phone : user.phone,
        about: req.body.about !== '' ? req.body.about : user.about
      }
      Object.assign(user, toChange)
      await user.save()
      res.status(200).json({ message: 'Данные успешно обновлены' });
    } catch (err) {
      console.log('err: ', err);
      res.status(500).json({ message: 'Ошибка при загрузке данных на сервер' })
    }
  }
)

// Отправка сообщения от пользователя на почту
const transporter = nodemailer.createTransport(sendgrid({
  auth: { api_key: config.get('SEND_GRID_API') }
}))

router.post(
  '/feedback',
  [
    check('title', 'Тема сообщения не может быть пустой').isLength({ min: 1 }),
    check('text', 'Сообщение не может быть пустым').isLength({ min: 1 })
  ],
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401).json({ 'message': 'Пользователь не авторизован' });
        return false;
      }

      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })

      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Некорректные данные при отправке сообщения'
        })
      } 

      let role
      user.role === 0 ? role = 'студента' : role = 'преподователя'

      await transporter.sendMail({
        to: config.get('MY_EMAIL'),
        from: user.email,
        subject: `Обращение от ${role} ${user.name} ${user.subname} на тему - ${req.body.title}`,
        html: `
          <h1>${req.body.title}</h1>
          <p>${req.body.text}</p>
        `
      })
      res.status(200).json({ message: 'Сообщение отправлено' })
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка в отправке вашего сообщения' })
    }
  }
)

// Создание курса
router.post('/create-course', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ 'message': 'Пользователь не является преподавателем или администратором' });
    }
    
    let users = []
    users.push(user._id)
    const {name, description, direction, price} = req.body

    const currDirection = await Direction.findOne({ name: direction })

    if(currDirection == null) {
      return res.status(404).json({ 'message': 'Такого направления не существует. Создайте его!' });
    }

    const course = new Course({
      name: name,
      description: description,
      direction: currDirection._id,
      author: user._id,
      user: users,
      modules: [],
      lessons: [],
      price: price
    })
    await course.save()
    
    let createdCourses = []
    createdCourses.push(course._id)

    const toChange = {
      createdCourses: createdCourses
    }

    Object.assign(user, toChange)
    await user.save()

    return res.status(201).json({ course, message: 'Курс успешно сохранен! Можете переходить к заполнению' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при создании курса, попробуйте снова' })
  }
})

// Добавление нового направления обучения
router.post('/create-direction', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ 'message': 'Пользователь не является преподавателем или администратором' });
    }

    const {direction} = req.body

    const currDirection = await Direction.findOne({ name: direction })

    if(currDirection) {
      return res.status(404).json({ 'message': 'Такое направление уже существует' });
    }

    const newDir = new Direction({
      name: direction,
    })
    await newDir.save()
    
    return res.status(201).json({ direction, message: 'Направление успешно добавлено' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при добавлении направления, попробуйте снова' })
  }
})

// Получение всех направлений
router.get('/all-directions', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ 'message': 'Пользователь не является преподавателем или администратором' });
    }

    const directions = await Direction.find()
    return res.status(201).json(directions)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при добавлении направления, попробуйте снова' })
  }
})

// Удаление направления
router.post('/remove-direction', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ 'message': 'Пользователь не является преподавателем или администратором' });
    }
    
    const {name} = req.body
    await Direction.deleteOne({ name: name })

    return res.status(201).json({ message: 'Направление успешно удалено' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Изменение конкретного направления
router.post('/update-direction', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ 'message': 'Пользователь не является преподавателем или администратором' });
    }

    const {name, newName} = req.body
    const direction = await Direction.findOne({ name: name })

    const toChange = { name: newName }
    Object.assign(direction, toChange)
    await direction.save()

    return res.status(201).json({ message: 'Направление успешно изменено' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
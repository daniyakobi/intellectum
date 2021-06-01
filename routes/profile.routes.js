const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Direction = require('../models/Direction')
const Course = require('../models/Course')
const Profession = require('../models/Profession')
const Dialog = require('../models/Room')
const Message = require('../models/Message')
const router = Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')  
const fs = require('fs')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const path = require('path')
const config = require('config')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')

// Получение всех пользователей
router.get('/all-users', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    const users = await User.find()
    return res.status(201).json(users)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при получении всех пользователей, попробуйте снова' })
  }
})

// Получение всех студентов
router.get('/all-students', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const users = await User.find({role: 0})
    return res.status(201).json(users)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при получении всех студентов, попробуйте снова' })
  }
})

// Получить пользователя
router.get('/main',
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
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
router.post('/settings',
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]
      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
        return false;
      }
      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })
      const toChange = {
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

// Получить конкретного пользователя
router.get('/users/:id',
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
        return false;
      }

      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })

      const candidate = await User.findById(req.params.id)
      res.json(candidate)

    } catch (error) {
      return res.status(500).json({ message: 'Ошибка загрузки данных пользователя' })
    }
  }
)

// Хранилище для аватаров пользователей
const storageAvatars = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/avatars')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const allowedTypesAvatars = ['image/png', 'image/jpg', 'image/jpeg']
const fileFilterAvatars = (req, file, cb) => {
  if(allowedTypesAvatars.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
 
const uploadAvatars = multer({ storage: storageAvatars, fileFilter: fileFilterAvatars })

// Редактирование аватара пользователя
router.post('/avatar',
  uploadAvatars.single('avatar'), 
  async (req, res) => {
    try {
      let token = req.body.token.split(' ')[1]
      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
        return false;
      }
      const decoded = jwt.verify(token, config.get('jwtsecret'))
      
      const BASE_URL = config.get('BASE_URL')
      const avatarPath = `/${req.file.destination}/${req.file.filename}`
      await User.findOneAndUpdate({ _id: decoded.userId }, { avatarUrl: avatarPath })
      return res.status(200).json({ message: 'Аватар успешно загружен' });
      
    } catch (err) {
      res.status(500).json({ message: 'Ошибка при загрузке данных на сервер' })
    }
  })

// Отправка сообщения от пользователя на почту
const transporter = nodemailer.createTransport(sendgrid({
  auth: { api_key: config.get('SEND_GRID_API') }
}))

router.post('/feedback',
  [
    check('title', 'Тема сообщения не может быть пустой').isLength({ min: 1 }),
    check('text', 'Сообщение не может быть пустым').isLength({ min: 1 })
  ],
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
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
      return res.status(200).json({ message: 'Сообщение отправлено' })
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка в отправке вашего сообщения' })
    }
  }
)

// Хранилище для изображений курсов
const storageThumbs = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/thumbs')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const allowedTypesThumbs = ['image/png', 'image/jpg', 'image/jpeg']
const fileFilterThumbs = (req, file, cb) => {
  if(allowedTypesThumbs.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
 
const uploadThumbs = multer({ storage: storageThumbs, fileFilter: fileFilterThumbs })

// Создание курса
router.post('/create-course', 
  uploadThumbs.single('thumb'),
  async (req, res) => {
    try {
      let token = req.body.token.split(' ')[1]

      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
        return false;
      }

      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })

      if(user.role === 0) {
        return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
      }

      const {name, description, direction, price} = req.body
      const thumbPath = `/${req.file.destination}/${req.file.filename}`

      const currDirection = await Direction.findOne({ name: direction })

      if(currDirection == null) {
        return res.status(404).json({ message: 'Такого направления не существует. Создайте его!' });
      }

      const course = new Course({
        name: name,
        description: description,
        author: user._id,
        direction: currDirection._id,
        modules: [],
        price: price,
        thumb: thumbPath,
        profession: []
      })
      await course.save()

      let createdCourses = user.createdCourses
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

// Изменить курс
router.post('/update-course',
  uploadThumbs.single('thumb'),
  async (req, res) => {
    try {
      let token = req.body.token.split(' ')[1]
      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
        return false;
      }
      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })

      const {name, description, courseId, price} = req.body

      let thumbPath
      if(req.file) {
        thumbPath = `/${req.file.destination}/${req.file.filename}`
      } else {
        thumbPath = ''
      }

      const candidate = await Course.findOne({ _id: courseId })

      if(!candidate) {
        return res.status(401).json({ message: 'Курс не найден'})
      }

      const toChange = {
        name: name ? name : candidate.name,
        description: description ? description : candidate.description,
        price: price ? price : candidate.price,
        thumb: thumbPath !== '' ? thumbPath : candidate.thumb
      }
      Object.assign(candidate, toChange)
      await candidate.save()
      res.status(200).json({ message: 'Данные успешно обновлены' });
    } catch (err) {
      console.log('err: ', err);
      res.status(500).json({ message: 'Ошибка при загрузке данных на сервер' })
    }
  }
)

// Добавление нового направления обучения
router.post('/create-direction', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const {direction} = req.body

    const currDirection = await Direction.findOne({ name: direction })

    if(currDirection) {
      return res.status(404).json({ message: 'Такое направление уже существует' });
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
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const directions = await Direction.find()
    return res.status(201).json(directions)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при получении всех направлений, попробуйте снова' })
  }
})

// Удаление направления
router.post('/remove-direction', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }
    
    const {name} = req.body
    await Direction.deleteOne({ name: name })

    return res.status(201).json({ message: 'Направление успешно удалено, обновите список направлений' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Изменение конкретного направления
router.post('/update-direction', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const {name, newName} = req.body
    const direction = await Direction.findOne({ name: name })
    const newDirection = await Direction.findOne({ name: newName })

    if(newDirection) return res.status(404).json({ message: `Нельзя изменить название на ${newName}, так как существует направление с таким названием` });

    const toChange = { name: newName }
    Object.assign(direction, toChange)
    await direction.save()

    return res.status(201).json({ message: 'Направление успешно изменено, обновите список направлений' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Изменить роль пользователя
router.post('/update-role',
  async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1]

      if (!token) {
        res.status(401).json({ message: 'Пользователь не авторизован' });
        return false;
      }

      const decoded = jwt.verify(token, config.get('jwtsecret'))
      const user = await User.findOne({ _id: decoded.userId })

      if(user.role !== 2) {
        return res.status(401).json({ message: 'Пользователь не является администратором' });
      }
      const {candidateId, newRole} = req.body
      let role
      if(newRole === 'Студент') {
        role = 0
      } else if(newRole === 'Преподаватель') {
        role = 1
      } else { role = 2 }
      const candidate = await User.findOne({ _id: candidateId })

      const toChange = { role: role }
      Object.assign(candidate, toChange)
      await candidate.save()

      return res.status(201).json({ message: 'Роль изменена' })
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка в попытке смены роли' })
    }
  }
)

// Добавление профессии
router.post('/create-profession', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const {newProfession, newDescription, direction} = req.body

    const currProfession = await Profession.findOne({ name: newProfession })

    if(currProfession) {
      return res.status(404).json({ message: 'Такая профессия уже существует' });
    }

    const dir = await Direction.findOne({name: direction})

    const newProf = new Profession({
      name: newProfession,
      description: newDescription,
      courses: [],
      direction: dir._id
    })
    await newProf.save()
    
    return res.status(201).json({ newProfession, message: 'Профессия успешно добавлена' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при добавлении профессии, попробуйте снова' })
  }
})

// Добавление курса в профессию
router.post('/add-course-to-profession', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const {courseId, addProfession} = req.body

    const currProfession = await Profession.findOne({ name: addProfession })

    if(!currProfession) {
      return res.status(404).json({ message: 'Такой профессии не существует' });
    }

    const currCourse = await Course.findOne({ _id: courseId })
    if(!currCourse) {
      return res.status(404).json({ message: 'Такого курса не существует' });
    }

    let currProfCourse = currCourse.profession // массив профессий курса
    if(currProfCourse.length) {
      if(currProfCourse.indexOf(currProfession._id) != -1) {
        return res.status(401).json({ message: 'Курс уже относится к выбранной профессии' });
      }
    } else {
      currProfCourse = []
    }
    currProfCourse.push(currProfession._id)
    const toChangeCourse = {
      profession: currProfCourse
    }
    Object.assign(currCourse, toChangeCourse)
    await currCourse.save()

    let currCourseProf = currProfession.courses // массив курсов у профессии
    if(currCourseProf.length) {
      if(currCourseProf.indexOf(currCourse._id) != -1) {
        return res.status(401).json({ message: 'Курс уже относится к выбранной профессии' });
      }
    } else {
      currCourseProf = []
    }
    currCourseProf.push(currCourse._id)
    const toChangeProf = {
      courses: currCourseProf
    }
    Object.assign(currProfession, toChangeProf)
    await currProfession.save()

    return res.status(201).json({ addProfession, message: 'Курс добавлен в профессию' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при добавлении профессии, попробуйте снова' })
  }
})

// Удаление профессии
router.post('/delete-profession', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }
    
    const {deleteProfession} = req.body
    const deleteProf = await Profession.findOne({ name: deleteProfession })

    if(!deleteProf) {
      return res.status(404).json({ message: 'Такой профессии не существует' });
    }

    let tmpProf = {
      profession: ''
    }

    const courses = await Course.find()
    courses.map( async (item, index) => {
      const profs = item.profession
      const i = profs.indexOf(deleteProf._id)
      if(i !== -1) {
        profs.splice(i, 1)
        tmpProf.profession = profs
        Object.assign(item, tmpProf)
        await item.save()
      }
    })
    
    await Profession.deleteOne({ name: deleteProfession })

    return res.status(201).json({ message: 'Профессия успешно удалена' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получение конкретной профессии

// Получение всех профессий
router.get('/professions', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const professions = await Profession.find()
    return res.status(201).json(professions)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при получении всех профессий, попробуйте снова' })
  }
})

// Получить все модули курса
router.get('/get-modules', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const courseId = req.headers.courseid
    
    const course = await Course.findOne({ _id: courseId })
    
    const modules = await Module.find({ course: course._id })
    
    return res.status(201).json(modules)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получить все уроки модуля
router.get('/get-lessons', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const moduleId = req.headers.moduleid
    
    const lessons = await Lesson.find({ module: moduleId })
    
    return res.status(201).json(lessons)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получить урок
router.get('/get-lesson', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const moduleId = req.headers.moduleid
    const lessonId = req.headers.lessonid
    
    const lesson = await Lesson.findOne({ _id: lessonId, module: moduleId })
    
    return res.status(201).json(lesson)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Публикация курса
router.post('/publicated-course', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }
    
    const {courseId} = req.body
    const course = await Course.findOne({ _id: courseId })

    if(!course) {
      return res.status(404).json({ message: 'Такого курса не существует' });
    }

    const modules = course.modules
    if(!modules.length) {
      return res.status(404).json({ message: 'Для публикации курса необходимо создать модули' });
    }

    modules.forEach(async item => {
      const module = await Module.findOne({_id: item}) 
      const lessons = module.lessons
      if(!lessons.length) {
        return res.status(404).json({ message: 'Для публикации курса необходимо в модулях создать уроки' });
      }
    })
    let tmpPublic = {
      publication: 1
    }

    Object.assign(course, tmpPublic)
    await course.save()

    let currCourses = user.currentCourses
    currCourses.push(course._id)

    let toChange = { currentCourses: currCourses }
    Object.assign(user, toChange)
    await user.save()

    return res.status(201).json({ message: 'Курс успешно опубликован' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Снятие курса с публикации
router.post('/unpublicated-course', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }
    
    const {courseId} = req.body
    const course = await Course.findOne({ _id: courseId })

    if(!course) {
      return res.status(404).json({ message: 'Такого курса не существует' });
    }

    let tmpPublic = {
      publication: 0
    }

    Object.assign(course, tmpPublic)
    await course.save()

    let currCourses = user.currentCourses
    const i = currCourses.indexOf(course._id)
    if(i !== -1) {
      currCourses.splice(i, 1)
      let toChange = { currentCourses: currCourses }
      Object.assign(user, toChange)
      await user.save()
    }

    return res.status(201).json({ message: 'Курс успешно снят с публикации' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Выдача доступа студенту
router.post('/open-course', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }

    const { userId, courseId } = req.body
    const candidate = await User.findOne({ _id: userId })

    if(!candidate) {
      return res.status(404).json({ message: 'Такого студента не существует' })
    }

    const course = await Course.findOne({ _id: courseId })

    if(!course) {
      return res.status(404).json({ message: 'Такого курса не существует' })
    }

    if(course.publication == 0) return res.status(400).json({ message: 'Курс не опубликован' })

    const candidateCurrCourses = candidate.currentCourses
    const i = candidateCurrCourses.indexOf(course._id)
    if(i !== -1) {
      return res.status(404).json({ message: 'Курс уже есть у студента' })
    }

    candidateCurrCourses.push(course._id)
    let toChange = { currentCourses: candidateCurrCourses }
    Object.assign(candidate, toChange)
    await candidate.save()

    return res.status(201).json({ message: `Курс открыт для студента - ${candidate.subname} ${candidate.name}` })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Закрыть курс студенту
router.post('/close-course', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ message: 'Пользователь не является преподавателем или администратором' });
    }
    
    const { userId, courseId } = req.body
    const candidate = await User.findOne({ _id: userId })

    if(!candidate) {
      return res.status(404).json({ message: 'Такого студента не существует' })
    }

    const course = await Course.findOne({ _id: courseId })

    if(!course) {
      return res.status(404).json({ message: 'Такого курса не существует' })
    }

    const candidateCurrCourses = candidate.currentCourses
    const i = candidateCurrCourses.indexOf(course._id)
    if(i === -1) {
      return res.status(404).json({ message: 'У студента нет такого курса' })
    }

    candidateCurrCourses.splice(i, 1)
    let toChange = { currentCourses: candidateCurrCourses }
    Object.assign(candidate, toChange)
    await candidate.save()
    
    return res.status(201).json({ message: `Курс закрыт для студента - ${candidate.subname} ${candidate.name}` })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Удалить курс
router.post('/delete-course', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ isDelete: false, message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })

    if(user.role === 0) {
      return res.status(401).json({ isDelete: false, message: 'Пользователь не является преподавателем или администратором' });
    }

    const {deleteCourse, courseId} = req.body
    
    const course = await Course.findOne({ _id: courseId })
    if(!course) return res.status(404).json({ isDelete: false, message: 'Такого курса не существует' })
    if(course.name !== deleteCourse) res.status(400).json({ isDelete: false, message: 'Введенный курс не совпадает с названием удаляемого курса' })

    const modules = await Module.find({ course: course._id })
    if(modules) {
      modules.forEach(async module => {
        const lessons = module.lessons
        lessons.forEach(async lesson => {
          const currLesson = await Lesson.findOne({_id: lesson})
          const video = currLesson.video
          fs.unlinkSync(`.${video}`)
          await Lesson.deleteOne({_id: lesson})
        })
        await Module.deleteOne({_id: module})
      })
    }

    await Course.deleteOne({ _id: courseId })

    const users = await User.find()
    users.forEach(async user => {
      let current = user.currentCourses
      let completed = user.completedCourses
      let created = user.createdCourses

      const currentIndex = current.indexOf(courseId)
      if(currentIndex !== -1) {
        current.splice(currentIndex, 1)
        const toChange = { currentCourses: current }
        Object.assign(user, toChange)
        await user.save()
      }

      const comletedIndex = completed.indexOf(courseId)
      if(comletedIndex !== -1) {
        completed.splice(comletedIndex, 1)
        const toChange = { completedCourses: completed }
        Object.assign(user, toChange)
        await user.save()
      }

      const createdIndex = created.indexOf(courseId)
      if(createdIndex !== -1) {
        created.splice(createdIndex, 1)
        const toChange = { createdCourses: created }
        Object.assign(user, toChange)
        await user.save()
      }
    })

    return res.status(201).json({ isDelete: true, message: 'Курс успешно удален' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
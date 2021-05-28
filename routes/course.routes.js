const {Router} = require('express')
const Course = require('../models/Course')
const Module = require('../models/Module')
const Lesson = require('../models/Lesson')
const Test = require('../models/Test')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()
const multer = require('multer')  
const fs = require('fs')

// Получение созданных курсов
router.get('/my-created-courses', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))

    const courses = await Course.find({ author: decoded.userId })
    res.json(courses)
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получение текущих курсов
router.get('/my-current-courses', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({_id: decoded.userId })

    const currCourses = user.currentCourses
    let result = []
    if(!currCourses.length) res.json(result)
    if(currCourses.length) {
      currCourses.forEach(async (item, index) => {
        const curr = await Course.findOne({_id: item})
        result.push(curr)
        if(index + 1 === currCourses.length) res.json(result)
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получение завершенных курсов
router.get('/my-completed-courses', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({_id: decoded.userId })

    const completedCourses = user.completedCourses
    let result = []
    if(!completedCourses.length) res.json(result)
    if(completedCourses.length) {
      completedCourses.forEach(async (item, index) => {
        const completed = await Course.One({_id: item})
        result.push(completed)
        if(index + 1 === currCourses.length) res.json(result)
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получение конкретного курса
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.json(course)
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получений курсов по направлению
router.get('/:direction', async (req, res) => {
  try {

  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Создание модуля
router.post('/create-module', async (req, res) => {
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

    const {name, description, courseId} = req.body

    const course = await Course.findOne({_id: courseId})

    if(!course) {
      return res.status(404).json({ message: 'Такого курса не существует существует' });
    }

    const module = new Module({
      name: name,
      description: description,
      course: course._id,
      lessons: [],
      tests: []
    })
    await module.save()

    let modulesCourses = course.modules
    modulesCourses.push(module._id)

    const toChange = {
      modules: modulesCourses
    }
    Object.assign(course, toChange)
    await course.save()
    
    return res.status(201).json({ module, message: 'Модуль успешно добавлен' })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Ошибка при добавлении модуля, попробуйте снова' })
  }
})

// Редактирование модуля
router.post('/update-module', async (req, res) => {
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

    const {name, description, courseId, moduleId} = req.body

    const course = await Course.findOne({_id: courseId})

    if(!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    const module = await Module.findOne({_id:moduleId})

    if(!module) {
      return res.status(404).json({ message: 'Модуль не найден' });
    }
    
    const toChange = { name: name ? name : module.name, description: description ? description : module.description}
    Object.assign(module, toChange)
    await module.save()

    return res.status(201).json({ message: 'Модуль успешно изменен' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Удаление модуля
router.post('/delete-module', async (req, res) => {
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
    
    const {courseId, moduleId} = req.body
    const module = await Module.findOne({ _id: moduleId })

    if(!module) {
      return res.status(404).json({ message: 'Такого модуля не существует' });
    }

    let tmpModules = {
      modules: ''
    }

    const course = await Course.findOne({_id: courseId})
    let modules = course.modules
    const i = modules.indexOf(module._id)
    if(i !== -1) {
      modules.splice(i, 1)
      tmpModules.modules = modules
      Object.assign(course, tmpModules)
      await course.save()
    }

    const lessons = module.lessons
    lessons.map(async (item,index) => {
      const lesson = await Lesson.findOne({_id: item})
      const video = lesson.video
      fs.unlinkSync(`.${video}`)
      await Lesson.deleteOne({_id: item})
    }) 

    // const tests = module.tests
    // tests.map(async (item,index) => {
    //   await Test.deleteOne({_id: item})
    // }) 

    await Module.deleteOne({ _id: moduleId })

    return res.status(201).json({ message: 'Модуль успешно удален' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Хранилище для видео и постеров
const storageLessons = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/lessons')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const allowedTypesLessons = ['video/mp4']
const fileFilterLessons = (req, file, cb) => {
  if(allowedTypesLessons.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
 
const uploadLessons = multer({ storage: storageLessons, fileFilter: fileFilterLessons })

// Создание урока
router.post('/create-lesson', 
  uploadLessons.single('video'), async (req, res) => {
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

    const {name, description, courseId, moduleId} = req.body
    const videoPath = `/${req.file.destination}/${req.file.filename}`

    const course = await Course.findOne({_id: courseId})

    if(!course) {
      return res.status(404).json({ message: 'Такого курса не существует' });
    }

    const module = await Module.findOne({_id: moduleId})

    if(!module) {
      return res.status(404).json({ message: 'Такого модуля не существует' });
    }

    const lesson = new Lesson({
      name: name,
      description: description,
      course: course._id,
      module: module._id,
      video: videoPath
    })
    await lesson.save()

    let lessonsModule = module.lessons
    lessonsModule.push(lesson._id)

    const toChange = {
      lessons: lessonsModule
    }
    Object.assign(module, toChange)
    await module.save()
    
    return res.status(201).json({ module, message: 'Урок успешно добавлен' })
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка при добавлении урока, попробуйте снова' })
  }
})

// Редактирование урока
router.post('/update-lesson',
  uploadLessons.single('video'), async (req, res) => {
  try {
    console.log(req.body);
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

    const {name, description, courseId, moduleId, lessonId} = req.body
    let videoPath = ''
    if(req.file) {
      videoPath = `/${req.file.destination}/${req.file.filename}`
    }

    const course = await Course.findOne({_id: courseId})

    if(!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    const module = await Module.findOne({_id: moduleId})

    if(!module) {
      return res.status(404).json({ message: 'Модуль не найден' });
    }

    const lesson = await Lesson.findOne({_id: lessonId})

    if(!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    const video = lesson.video
    if(videoPath) { fs.unlinkSync(`.${video}`) }
    
    const toChange = { 
      name: name ? name : lesson.name, 
      description: description ? description : lesson.description,
      video: videoPath ? videoPath : lesson.video
    }
    Object.assign(lesson, toChange)
    await lesson.save()

    return res.status(201).json({ message: 'Урок успешно изменен' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Удаление урока
router.post('/delete-lesson', async (req, res) => {
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
    
    const {courseId, moduleId, lessonId} = req.body
    const module = await Module.findOne({ _id: moduleId })

    if(!module) {
      return res.status(404).json({ message: 'Такого модуля не существует' });
    }

    const lesson = await Lesson.findOne({ _id: lessonId })

    if(!lesson) {
      return res.status(404).json({ message: 'Такого урока не существует' });
    }

    let tmpLessons = {
      lessons: ''
    }

    let lessons = module.lessons
    const i = lessons.indexOf(lesson._id)
    if(i !== -1) {
      lessons.splice(i, 1)
      tmpLessons.lessons = lessons
      Object.assign(module, tmpLessons)
      await module.save()
    }

    const video = lesson.video
    fs.unlinkSync(`.${video}`)

    await Lesson.deleteOne({ _id: lesson._id })

    return res.status(201).json({ message: 'Урок успешно удален' })
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Создание теста
// Редактирование теста
// Удаление теста


module.exports = router
const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const router = Router()
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const transporter = nodemailer.createTransport(sendgrid({
  auth: { api_key: config.get('SEND_GRID_API') }
}))

// Регистрация
router.post(
  '/register', 
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      } 
      const {name, email, password} = req.body
      const candidate = await User.findOne({ email })
      if(candidate) {
        return res.status(400).json({ message: `Пользователь ${ email } уже существует` })
      } else {
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ 
          name: name, 
          subname: '',
          patronymic: '',
          date: '',
          phone: '',
          country: '',
          city: '',
          avatarUrl: '',
          about: '',
          bonusCurrent: 0,
          bonusAll: 0,
          bonusSell: 0,
          email: email, 
          password: hashedPassword, 
          role: 0,
          completedCourses: [],
          currentCourses: [],
          createdCourses: [],
          notify: [],
          operations: [],
          dialogs: [],
          online: false
        })
        await user.save()
        await transporter.sendMail({
          to: email,
          from: config.get('MY_EMAIL'),
          subject: `Аккаунт ${email} создан`,
          html: `
            <h1>Здравствуйте, ${name}</h1>
            <p>Добро пожаловать на платформу Intellectum! Переходите по ссылке ниже и начните обучаться</p>
            <p>Также не забудьте указать информацию о себе в настройках</p>
            <hr />
            <a href="${config.get('BASE_URL')}">Перейти в профиль</a>
          `
        })
        res.status(201).json({ message: `Вы успешно прошли регистрацию` })
      }
    } catch(e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

// Авторизация
router.post(
  '/login', 
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        })
      } 
      const {email, password} = req.body
      const user = await User.findOne({ email })
      if(!user) {
        return res.status(400).json({ message: `Пользователь ${ email } не найден` })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль' })
      }
      const token = jwt.sign(
        { userId: user.id }, // Поля, которые будут храниться в токене
        config.get('jwtsecret'),
        { expiresIn: '8h' }
      )

      const toChange = {
        online: true
      }
      Object.assign(user, toChange)
      await user.save()

      res.status(200).json({ token, userId: user.id, userRole: user.role, message: `Авторизация прошла успешно. Здравствуйте, ${ user.name }!` })
    } catch(e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

// Запрос на сброс пароля
router.post(
  '/reset',
  (req, res) => {
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if(err) {
          return res.status(500).json({ message: 'Что-то пошло не так, повторите попытку позже' })
        }
        const token = buffer.toString('hex')
        const candidate = await User.findOne({ email: req.body.email })

        if(candidate) {
          candidate.resetToken = token
          candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
          await candidate.save()
          await transporter.sendMail({
            to: candidate.email,
            from: config.get('MY_EMAIL'),
            subject: `Восстановление доступа к аккаунту ${candidate.email}`,
            html: `
              <h1>Забыли пароль?</h1>
              <p>Если вы не отправляли запрос на восстановление пароля, то проигнорируйте данное письмо</p>
              <p>Иначе перейдите по ссылке ниже</p>
              <hr />
              <a href="${config.get('BASE_URL')}/password/${token}">Восстановить доступ</a>
            `
          })
          return res.status(200).json({ message: 'Письмо для восстановление отправлено на указанную почту' })
        } else {
          return res.status(400).json({ message: `Пользователь ${ req.body.email } не найден` })
        }
      })
    } catch (err) {
      return res.status(500).json({ message: 'Пользователя с таким email не существует' })
    }
  }
)

// Смена пароля
router.post(
  '/password/',
  async (req, res) => {
    try {
      if(!req.body.tokenReset) {
        return res.status(500).json({ message: 'Ошибка' })
      }
      const user = await User.findOne({ 
        resetToken: req.body.tokenReset,  
        resetTokenExp: { $gt: Date.now() }
      })
      if(!user) {
        return res.status(500).json({ message: 'Пользователь не существует' })
      } else {
        const candidate = await User.findOne({ 
          _id: user._id,
          resetToken: user.resetToken,  
          resetTokenExp: { $gt: Date.now() }
        })
        if(candidate) {
          if(req.body.password === req.body.passwordSec) {
            candidate.password = await bcrypt.hash(req.body.password, 12)
            candidate.resetToken = ''
            candidate.resetTokenExp = ''
            await candidate.save()
            return res.status(200).json({ message: 'Пароль успешно восстановлен' })
          } else {
            return res.status(400).json({ message: 'Пароли не совподают' })
          }
        } else {
          return res.status(500).json({ message: 'Ошибка! Попробуйте повторно отправить запрос на восстановление пароля' })
        }
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

// Выход из системы
router.post(
  '/logout', 
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
        online: false
      }
      Object.assign(user, toChange)
      await user.save()

      res.status(200).json({ message: `Вы успешно вышли из системы` })
    } catch(e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)
 
module.exports = router
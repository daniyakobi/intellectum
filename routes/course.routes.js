const {Router} = require('express')
const Course = require('../models/Course')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()



router.get('/', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))

    const courses = await Course.find({ user: decoded.userId })
    res.json(courses)
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.json(course)
  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/:direction', async (req, res) => {
  try {

  } catch (err) {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
const {Router} = require('express')
const User = require('../models/User')
const Room = require('../models/Room')
const Message = require('../models/Message')
const router = Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')  
const fs = require('fs')
const path = require('path')
const config = require('config')
const bcrypt = require('bcryptjs')

// Создание комнаты
router.post('/new-room', async (req, res) => {
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
    const { roomName, roomPassword } = req.body
    const hashedPassword = await bcrypt.hash(roomPassword, 12)

    const tmpRoom = await Room.findOne({ name: roomName })
    if(tmpRoom) return res.status(401).json({ message: `Комната ${ roomName } уже существует` })

    const users = []
    users.push(user._id)

    const room = new Room({
      name: roomName,
      password: hashedPassword,
      creator: `${user.name} ${user.subname}`,
      role: user.role,
      users: users,
      connected: []
    })

    await room.save()
    return res.status(200).json({ room: room, message: 'Комната создана' })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Получение комнат
router.get('/get-rooms', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }
    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })
    
    const rooms = await Room.find()
    
    const result = []
    rooms.forEach( async (item, index) => {
      const tmp = item.users
      const i = tmp.indexOf(user._id)
      if(i !== -1) {
        result.push(item)
      } 
      if( rooms.length === index + 1 ) return res.status(201).json(result)
    })   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Подключение к новой комнате
router.post('/connect-new-room', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }
    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })
    
    const { roomName, roomPassword } = req.body
    if(!roomPassword) return res.status(404).json({ message: 'Введите пароль' })

    const room = await Room.findOne({ name: roomName })
    if(!room) return res.status(404).json({ message: `Комната ${ roomName } не существует. Проверьте название` })
    
    const isMatch = await bcrypt.compare(roomPassword, room.password)
    if(!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' })
    }

    let users = room.users
    if(users.indexOf(user._id) !== 1) users.push(user._id)
    const toChange = {
      users: users
    }
    Object.assign(room, toChange)
    await room.save()

    return res.status(200).json({ room: room, message: 'Вы подключились к комнате' })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// Подключение к комнате
router.post('/connect-room', async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
      return false;
    }
    const decoded = jwt.verify(token, config.get('jwtsecret'))
    const user = await User.findOne({ _id: decoded.userId })
    
    const { roomName, roomPassword } = req.body
    if(!roomPassword) return res.status(404).json({ message: 'Введите пароль' })

    const room = await Room.findOne({ name: roomName })
    if(!room) return res.status(404).json({ message: `Комната ${ roomName } не существует. Проверьте название` })
    
    if(roomPassword !== room.password) return res.status(400).json({ message: 'Неверный пароль' })

    return res.status(200).json({ room: room, message: 'Вы подключились к комнате' })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


// Получение сообщений в комнате
router.get('/get-messages/:id', async (req, res) => {
  try {
    const { id: roomId } = req.params

    const room = await Room.findOne({ _id: roomId })
    if(!room) return res.status(404).json({ message: `Комната не существует` })

    const messages = await Message.find({ room: room._id })

    return res.status(200).json(messages)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = {
  router
}
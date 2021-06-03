const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const User = require('./models/User')
const Room = require('./models/Room')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use( '/public', express.static(path.resolve(__dirname, 'public')));
app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/course', require('./routes/course.routes'))
const { router } = require('./routes/chat.routes')
app.use('/api/chat', router)

// Работа с чатом
io.on('connection', socket => {
  let currRoom = ''

  socket.on('ROOM:CONNECT', async ({ roomName, userId }) => {
    try {
      socket.join(roomName)
      currRoom = roomName

      const room = await Room.findOne({ name: roomName })
      const user = await User.findOne({ _id: userId })
      const toChange = { 
        online: true,
        socketId: socket.id
      }
      Object.assign(user, toChange)
      await user.save()

      let users = []
      const tmpUsers = room.users 
      let connected = room.connected
      connected.push(user._id)
      const toChangeRoom = { 
        connected: connected
      }
      Object.assign(room, toChangeRoom)
      await room.save()

      for (let index = 0; index < tmpUsers.length; index++) {
        const element = tmpUsers[index];
        const user = await User.findOne({ _id: element })
        if(user) users.push(user)
      }
      socket.broadcast.to(roomName).emit('ROOM:CONNECT', users)
    } catch(err) {
      console.log(err);
    }
  })

  socket.on('ROOM:NEW_MESSAGE', async ({ roomName, userId, text }) => {
    try {
      const room = await Room.findOne({ name: roomName })
      const user = await User.findOne({ _id: userId })
      const message = new Message({
        user: user._id,
        userName: `${user.name} ${user.subname}`,
        room: room._id,
        message: text,
        file: ''
      })
      await message.save()

      let mess = room.messages
      mess.push(message._id)
      const toChange = { messages: mess }
      Object.assign(room, toChange)
      let messages = []
      for (let index = 0; index < mess.length; index++) {
        const element = mess[index];
        const tmp = await Message.findOne({ _id: element })
        if(tmp) messages.push(tmp)
      }

      socket.broadcast.to(roomName).emit('ROOM:NEW_MESSAGE', messages)
    } catch(err) {
      console.log(err);
    }
  })

  socket.on('disconnect', async () => {
    try {
      let users = []
      const room = await Room.findOne({ name: currRoom })
      const user = await User.findOne({ socketId: socket.id })
      let connected = room.connected
      const i = connected.indexOf(user._id)
      if(i !== -1) connected.splice(i, 1)

      for (let index = 0; index < connected.length; index++) {
        const element = connected[index];
        const user = await User.findOne({ _id: element })
        if(user) users.push(user)
      }

      const toChangeRoom = { 
        connected: connected
      }
      Object.assign(room, toChangeRoom)
      await room.save()

      const toChange = { 
        online: false,
        socketId: ''
      }
      Object.assign(user, toChange)
      await user.save()

      socket.broadcast.to(room.name).emit('ROOM:LEAVE', users)
    } catch (err) {
      console.log(err);
    }
  })
})

const PORT = config.get('port') || 5000
async function start() {
  try {
    // Подключение к БД
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server error - ', e.message)
    process.exit(1)
  }
}

start()
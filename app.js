const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path');

const fileMiddleware = require('./middleware/file')

const app = express()

app.use(express.static(__dirname));
app.use(express.json({ extended: true }))
// app.use(fileMiddleware.single('avatar'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/course', require('./routes/course.routes'))

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
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server error - ', e.message)
    process.exit(1)
  }
}

start()


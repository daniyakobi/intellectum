const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: Types.ObjectId, ref: 'Course' },
  module: { type: Types.ObjectId, ref: 'Module' },
  video: { type: String, required: true }
})

module.exports = Lesson = mongoose.model('lesson', schema)


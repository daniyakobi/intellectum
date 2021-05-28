const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: Types.ObjectId, ref: 'Course' },
  lessons: [{ type: Types.ObjectId, ref: 'Lesson', default: [] }], 
  tests: [{ type: Types.ObjectId, ref: 'Test', default: [] }], 
})

module.exports = Module = mongoose.model('module', schema)
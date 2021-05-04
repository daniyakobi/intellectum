const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')
const schema = new Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Types.ObjectId, ref: 'User', required: true },
  direction: { type: Types.ObjectId, ref: 'Direction', required: true },
  user: { type: Types.ObjectId, ref: 'User' },
  modules: [{ type: Types.ObjectId, ref: 'Module', default: [] }], 
  lessons: [{ type: Types.ObjectId, ref: 'Lesson', default: [] }],
  date: { type: Date, default: Date.now },
  complete: { type: Number, default: 0 },
  price: { type: Number, required: true},
  thumb: { type: String, default: '' },
  publish: { type: Number, default: 0 }
})

module.exports = Course = mongoose.model('courses', schema)
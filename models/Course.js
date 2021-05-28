const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Types.ObjectId, ref: 'User', required: true },
  direction: { type: Types.ObjectId, ref: 'Direction' },
  modules: [{ type: Types.ObjectId, ref: 'Module', default: [] }], 
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true},
  thumb: { type: String, default: '' },
  profession: [{ type: Types.ObjectId, ref: 'Profession', default: []}],
  publication: { type: Number, default: 0 }
})

module.exports = Course = mongoose.model('courses', schema)
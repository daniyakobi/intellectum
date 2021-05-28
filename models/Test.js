const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')
const schema = new Schema({ 
  name: { type: String, required: true },
  module: { type: Types.ObjectId, ref: 'Module' },
  questions: { type: Array, default: [] }
})

module.exports = Test = mongoose.model('test', schema)
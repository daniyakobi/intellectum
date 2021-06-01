const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  user: { type: Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  room: { type: Types.ObjectId, ref: 'Dialog', required: true },
  message: { type: String, required: true },
  file: { type: String }
})

module.exports = Message = mongoose.model('messages', schema)
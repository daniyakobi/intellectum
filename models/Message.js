const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  from: { type: Types.ObjectId, ref: 'User', required: true },
  to: { type: Types.ObjectId, ref: 'User', required: true },
  dialog: { type: Types.ObjectId, ref: 'Dialog', required: true },
  message: { type: String, required: true },
  file: { type: String },
  isRead: { type: Boolean, required: true, default: false }
})

module.exports = Message = mongoose.model('message', schema)
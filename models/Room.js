const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creator: { type: String, required: true },
  role: { type: Number, required: true },
  users: [{ type: Types.ObjectId, ref: 'User', default: [] }],
  connected: [{ type: Types.ObjectId, ref: 'User', default: [] }],
  messages: [{ type: Types.ObjectId, ref: 'Message', default: [] }]
})

module.exports = Room = mongoose.model('rooms', schema)
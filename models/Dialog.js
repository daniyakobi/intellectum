const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({ 
  users: [{ type: Types.ObjectId, ref: 'User', required: true }]
})

module.exports = Dialog = mongoose.model('dialog', schema)
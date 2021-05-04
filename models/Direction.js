const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')
const schema = new Schema({ 
  name: { type: String, required: true, unique: true }
})

module.exports = Direction = mongoose.model('directions', schema)
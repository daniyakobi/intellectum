const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')
const schema = new Schema({ 
  name: { type: String, required: true },
  description: { type: String, required: true },
  courses: [{ type: Types.ObjectId, ref: 'Course', default: [] }],
  direction: { type: Types.ObjectId, ref: 'Direction' }
})

module.exports = Profession = mongoose.model('profession', schema)
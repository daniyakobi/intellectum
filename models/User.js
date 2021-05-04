const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose')
const schema = new Schema({ 
  name: { type: String, required: true },
  subname: { type: String },
  patronymic: { type: String },
  date: { type: String },
  phone: { type: String },
  country: { type: String },
  city: { type: String },
  avatarUrl: { type: String },
  about: { type: String },
  bonusCurrent: { type: Number },
  bonusAll: { type: Number },
  bonusSell: { type: Number },
  completedCourses: [{ type: Types.ObjectId, ref: 'Course' }],
  currentCourses: [{ type: Types.ObjectId, ref: 'Course' }],
  createdCourses: [{ type: Types.ObjectId, ref: 'Course' }],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notify: [{ type: Types.ObjectId, ref: 'Notify' }],
  operations: [{ type: Types.ObjectId, ref: 'Operations' }],
  role: { type: Number, required: true },
  resetToken: { type: String },
  resetTokenExp: { type: Date }
})

module.exports = User = mongoose.model('user', schema)
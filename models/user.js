const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required:true },
  email: { type: String, required:true },
  password: { type: String, required:true },
  first_name: { type: String, required:true },
  last_name: { type: String, required:true },
  art: [String],
})

module.exports = mongoose.model('User', userSchema)
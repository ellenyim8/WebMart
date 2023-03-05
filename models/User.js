const mongoose = require('mongoose') //mongodb

const Schema = mongoose.Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: 'username'
  },
  password: {
    type: String,
    required: true,
    default: 'username'
  },
  address: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  dateOfEntry: {
    type: Date,
    default: Date.now(),
    required: true
  },
  img: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: 'Empty'
  },
  type: {
    type: String,
    required: true,
    // specifies if User or Admin
    default: 'User'
  },
  friends: [String],
  friend_requests: [String]
})

module.exports = Item = mongoose.model('user', userSchema)

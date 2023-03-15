const mongoose = require('mongoose') //mongodb
const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Unnamed Item'
  },
  seller:{
    type: String,
    required: true,
    deault: 'Admin'
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  purchased: {
    type: Boolean,
    required: true,
    default: false
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  tag: {
    type: [String],
    required: true,
    default: []
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Empty'
  },
  image:{
    type: String,
    default : 'default.png'
  }
})

module.exports = mongoose.model('Item', itemSchema)
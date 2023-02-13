const mongoose = require('mongoose') //mongodb
const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Unnamed Item'
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
  tag: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Empty'
  },
})

module.exports = mongoose.model('Item', itemSchema)

const mongoose = require('mongoose') //mongodb

const Schema = mongoose.Schema
const item = new Schema ({
    userID : {
        type: Number, 
        required: true
    },

    itemID : {
        type: Number, 
        required: true 
    },

    name : {
        type: String,
        required: true
    },

    desc : {
        type: String,
        default: ''
    },

    price : {
        type: String,
        required: true,
        default: ''
    },

    type: {
        type: String,
        required: true,
        default: 'Seller' // specify if user is seller/buyer
    },

    img : {
        type: String,
        default: ''
    },

    location : {
        type: String, 
        default: ''
    },

    listItems: [String]
    
})

module.exports = mongoose.model('Create Item', item);
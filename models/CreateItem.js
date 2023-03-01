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
        required: true
    },

    img : {
        type: String, // 

        required: true
    },

    location : {
        type: String, 
        required: true
    }
    
})

module.exports = mongoose.model('Create Item', item)

//does this go in separate file or server.js? 
/* 
  exports.items = async () => {
    const items = await createItem.find();
    return items; 
  };
  
  exports.itemByID = async id => {
    const item = await createItem.findById(id);
  };
  } */
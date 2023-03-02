const mongoose = require('mongoose')
const dotenv = require("dotenv");
const { db } = require('../models/User');
dotenv.config({ path: 'Key.env' });

class Mongo{
    constructor(){
        const db = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lsugg8d.mongodb.net/?retryWrites=true&w=majority` // pull mongo uri from Key.env variables
        mongoose.connect(
        db, //connect to db
        err => {
            if (err) throw err
            console.log('Connected to MongoDB!')
        }
        )
    }

    getDB(){
        return db;
    }

    close(){
        db.close()
    }
}

function getInstance(){
    if (!this.instance){
        this.instance = new Mongo()
    }
    return this.instance
}

function closeInstance(){
    getInstance().close()
}

module.exports = {
    getInstance,
    closeInstance
};
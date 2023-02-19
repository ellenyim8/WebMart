/*
    This project is done in Express, NodeJS, and uses MongoDB
    First time opening this project? Install all dependencies with the following command: "npm install"
    To start the local host server, run "npm start" (uses nodemon to constantly update page so no restarts necessary after changes, just refresh the page)
*/

// import dependencies
const express = require('express')
const cookieParser = require('cookie-parser')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const dotenv = require("dotenv")
dotenv.config({ path: 'Key.env' });
const mongoose = require('mongoose')

//import folders
const config = require('config')
const { request } = require('http')

// import handlers
const landingHandler = require('./handlers/landing.js')
const homeHandler = require('./handlers/home.js')
const loginHandler = require('./handlers/login.js')
const registerHandler = require('./handlers/register.js')

//import models for MongoDB
const User = require('./models/User')

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'))
//public files in directory
app.use(express.static(path.join(__dirname, 'public'))) 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

//HBS
app.engine(
  'hbs',
  hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/'
  })
)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// const db = config.get('mongoURL') //pull db information from config
const db = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lsugg8d.mongodb.net/?retryWrites=true&w=majority` // pull mongo uri from Key.env variables
mongoose.connect(
  db, //connect to db
  err => {
    if (err) throw err
    console.log('Connected to MongoDB!')
  }
)

//------------------------------------------------------------------------------------

//TEST USER ACCOUNTS
// user account: user@abc, 123
// admin account: Admin@abc, 123

app.route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean() //searches through all known users for email

    if (!user) {
      return res.redirect('/login?error=1') //No user found error
    }

    if (password == user.password) {
      req.session.logged_in = true
      req.session.username = user.username
      req.session.type = user.type
      res.redirect('/home')
    } 
    else {
      res.redirect('/login?error=1') //wrong password error
    }
  })

// ADD LOGOUT HANDLER IN THE FUTURE
app.get('/logout', (req, res) => {
  req.session.logged_in = false
  req.session.username = null
  req.session.type = null
  console.log('Logging out...')
  res.redirect('/')
})

//DEBUG RETURNS ALL USERS AS JSON 
app.get('/getUsers', function (req, res) {
  User.find({
    type: 'User',
  })
    .lean()
    .then(item => {
      res.json(item)
    })
})

app.route('/register')
  .post(async (req, res) => {
    const { email, username, password, confirmPassword } = req.body
    const mail = await User.findOne({ email }).lean() //searches through all known users for email
    const user = await User.findOne({username}).lean() //seraches through all known users for username

    if (mail) {
      console.log("Email already exists")
      return res.redirect('/register?error=1') //Account already exist
    }
    else if (email == '')
    {
      return res.redirect('/register?error=1-1')
    }
    else if(user)
    {
      console.log("Username already exist")
      return res.redirect('/register?error=2')
    }
    else if(username == "")
    {
      return res.redirect('/register?error=2-1')
    }
    else if(password != confirmPassword)
    {
      console.log("password is different")
      return res.redirect('/register?error=3')
    }
    //Create User
    else{      
      var newUser = User.create({
        type : 'User',
        username : username,
        password : password,
        email : email       
      })
      
      res.redirect('/login')
    }
  })



//Not Implemented Yet
// //create Item Listings
// app.route('/itemListing')
//   .post(async function (req, res) {
//     const { text, creation_date, seller, starting_bid } = req.body
//     const newItemListing = new ItemListing({
//       text: text,
//       creation_date: creation_date,
//       seller: seller,
//       starting_bid: starting_bid
//     })

//     newItemListing
//       .save()
//       .then(console.log('New item listing created'))
//       .catch(err => console.log('Error when creating announcements:', err))
//     res.redirect('/home')

//   })


// URL handlers
app.get('/', landingHandler.getLanding);
app.get('/home', homeHandler.getHome);
app.get('/login', loginHandler.getLogin);
app.get('/register', registerHandler.getRegister);


app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
)

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

const mongo = require('./modules/MongoConnection.js').getInstance()

//import folders
const config = require('config')
const { request } = require('http')

// import handlers
const landingHandler = require('./handlers/landing.js')
const homeHandler = require('./handlers/home.js')
const loginHandler = require('./handlers/login.js')
const listItemsHandler = require('./handlers/listItems.js')
const registerHandler = require('./handlers/register.js') 
const createItemHandler = require('./handlers/createItems.js') 
//const createItemHandler = require('./handlers/createItem.js')
const profileHandler = require('./handlers/profile.js')
const friendsListHandler = require('./handlers/friendsList')

const userObj = require('./modules/user.js')

//import models for MongoDB
const User = require('./models/User')
const Item = require('./models/Items')
const createItem = require('./models/CreateItem') //

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
      const curUser = new userObj.BaseUser(user.username, user.email, user.address, user.dateOfEntry, user.img, user.about, user.type, user.friends, user.friend_requests)
      req.session.userObj = curUser
      req.session.username = user.username
      req.session.email = user.email
      req.session.img = user.img
      req.session.about = user.about
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

  // List Items Page Route
  app.get('/itemListing', (req, res) => {
    console.log('Navigating to Items List Page')
    res.render('listItems')
  })

  // CreateItem Page Route
  app.get('/createItem', (req, res) => {
    console.log('Navigating to createItem Page')
    res.render('createItems')
  })

//create Item Listings
app.route('/itemLists')
   .post(async function (req, res) {
     const { text, creation_date, seller, starting_bid } = req.body
     const newItemListing = new ItemListing({
       text: text,
       creation_date: creation_date,
       seller: seller,
       starting_bid: starting_bid
     })

     newItemListing
       .save()
       .then(console.log('New item listing created'))
       .catch(err => console.log('Error when creating announcements:', err))
     res.redirect('/home')

   })


  // Overview Page Route
  app.get('/overview', (req, res) => {
    console.log('Navigating to Overview/ItemListing Page')
    res.render('overview')
  })

  //need to change the body though 
  app.route('/createItem')
  .post(async function (req, res) {
    const { text, creation_date, seller, starting_bid } = req.body
    const newItemListing = new ItemListing({
      text: text,
      creation_date: creation_date,
      seller: seller,
      starting_bid: starting_bid
    })

    newItemListing
      .save()
      .then(console.log('New item listing created'))
      .catch(err => console.log('Error when creating announcements:', err))
    res.redirect('/home')

  })


app.route('/friend_requests')
.post(async function (req, res)  {
  const username = req.body.addUsername
  const requested_user = await User.findOne({username}).lean() //searches through all known users with target username
  if(!requested_user)
  {
    console.log("NO such account as :" + username)
  }
  else{
    console.log("success : " + requested_user.username)
    console.log("pushing : " + req.session.userObj.username)
    User.updateOne({username: requested_user.username}, {$push: { 'friend_requests' : req.session.userObj.username}  
    }) // update requested user's friends list to include the requester
  } 
})

/*
app.route('/friend_requests')
.post(async function (req, res)  {
  const {username} = req.body
  const requested_user = await User.findOne({username}).lean() //searches through all known users with target username
  User.updateOne({name: username}, {$push: { 'friend_requests': req.session.username}}) // update requested user's friends list to include the requester
})
*/

app.route('/accept_friend')
.post(async function (req, res)  {
  if (req.body.accept){
    User.updateOne({name: req.session.userObj.name}, {$push: { 'friends': req.body.username}}) // update current user's friends list to include the requester
    User.updateOne({name: req.body.username}, {$push: { 'friends': req.session.userObj.name}}) // update requester user's friends list to include the current user
    User.updateOne({name: req.session.userObj.name}, {$pull: { 'friend_requests': req.body.username}}) // update current user's friend request list to not include the requester
  }
  else {
    User.updateOne({name: req.session.userObj.name}, {$pull: { 'friend_requests': req.body.username}}) // if rejected, remove from pending requests
  }

})

// URL handlers
app.get('/', landingHandler.getLanding);
app.get('/home', homeHandler.getHome);
app.get('/login', loginHandler.getLogin);
app.get('/itemListing', listItemsHandler.getItemList);
app.get('/register', registerHandler.getRegister);
app.get('/createItem', createItemHandler.getCreateItem);
app.get('/profile', profileHandler.getProfile);
app.get('/friends', friendsListHandler.getFriendsList);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))

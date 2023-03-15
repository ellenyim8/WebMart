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
const editProfileHandler = require('./handlers/editProfile.js')
const friendProfileHandler = require('./handlers/friendProfile.js')

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

//DEBUG RETURNS ALL USERS AS JSON 
app.get('/getItems', function (req, res) {
  User.find({
    type: 'CreateItem',
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
      errorpage = "/register?error="
      haserror = false;
      if (mail) {
        console.log("Email already exists")
        errorpage += "em_1"
        haserror = true;
      }
      else if (email == '')
      {
        errorpage += "em_2"
        haserror = true;
      }
      if(user)
      {
        console.log("Username already exist")
        errorpage += "ID_1"
        haserror = true;
      }
      else if(username == "")
      {
        errorpage += "ID_2"
        haserror = true;
      }
      if(password != confirmPassword)
      {
        console.log("password is different")
        errorpage += "pw_1"
        haserror = true;
      }
    if(haserror)
    {
      haserror = false;
      res.redirect(errorpage)
    }
    //Create User
    else{
      console.log("creating user")      
      var newUser = User.create({
        type : 'User',
        username : username,
        password : password,
        email : email       
      })
      res.redirect('/login')
    }
  })

  app.route('/delete_user')
  .post(async function (req, res)  {
    const user_to_delete = req.body.username
    await User.deleteOne({username : user_to_delete})
    res.redirect('/')
  })

  app.route('/delete_item')
  .post(async function (req, res)  {
    const item_to_delete = req.body.item_id
    await Item.deleteOne({name : item_to_delete})
    res.redirect('/') // CHANGE THIS TO REFRESH PAGE
  })

  //List Items Page Route
  app.get('/itemListing', (req, res) => {
    console.log('Navigating to Items List Page')
    res.render('listItems')
  })

  //CreateItem Page Route
  app.get('/createItem', (req, res) => {
    console.log('Navigating to createItem Page')
    res.render('createItems')
  })

  // //Create Item  
  // app.route('/createItem')
  //   .post(async function (req, res) {
  //     const {id, name, desc, price } = req.body
  //     const item = await createItem.findOne({ id }).lean() //searches through all known users for id

  //     if (!item) {
  //       return res.redirect('/createItem') //No item found error
  //     }

  //     const newItem = new createItem({
  //       itemID: id, 
  //       name: name,
  //       desc: desc,
  //       price: price  
  //     })
  //       newItem
  //       .save()
  //       .then(console.log('new item added'))
  //       .catch(err=>console.log('error when creating item:', err))
  //       res.redirect('/itemLists')
  //   })
  

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

  // //need to change the body though 
  // app.route('/createItem')
  // .post(async function (req, res) {
  //   const { text, creation_date, seller, starting_bid } = req.body
  //   const newItemListing = new ItemListing({
  //     text: text,
  //     creation_date: creation_date,
  //     seller: seller,
  //     starting_bid: starting_bid
  //   })

  //   newItemListing
  //     .save()
  //     .then(console.log('New item listing created'))
  //     .catch(err => console.log('Error when creating announcements:', err))
  //   res.redirect('/home')

  // })


app.route('/friend_requests')
.post(async function (req, res)  {
  const username = req.body.addUsername
  const requested_user = await User.findOne({username}).lean() //searches through all known users with target username
  const findInFriendList = await User.findOne({ $and: [{username : req.session.username}, {friends : username}]}).lean();
  if(!requested_user)
  {
    console.log("NO such account as :" + username)
  }
  else if(username == req.session.username)
  {
    console.log("Can't request friend my self");
  }
  else if(findInFriendList)
  {
    console.log("Friend already exists");
  }
  else{
    console.log("success : " + requested_user.username)
    console.log("pushing : " + req.session.userObj.username)
    await User.updateOne({username: requested_user.username}, {$addToSet: { 'friend_requests' : req.session.userObj.username}  
    }) // update requested user's friends list to include the requester
  }
  res.redirect('/friends')
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
    console.log("Yes");
    await User.updateOne({username: req.session.username}, {$addToSet: { 'friends': req.body.friendlist}}) // update current user's friends list to include the requester
    await User.updateOne({username: req.body.friendlist}, {$addToSet: { 'friends': req.session.username}}) // update requester user's friends list to include the current user
    await User.updateOne({username: req.session.username}, {$pull: { 'friend_requests': req.body.friendlist}}) // update current user's friend request list to not include the requester
  }
  else {
    console.log("NO");
    await User.updateOne({username: req.session.username}, {$pull: { 'friend_requests': req.body.friendlist}}) // if rejected, remove from pending requests
  }
  username =  req.session.userObj.username;
  const user = await User.findOne({ username }).lean()
  if(user)
  {
    req.session.userObj.friends = user.friends;
    req.session.userObj.friend_requests = user.friend_requests;
  }
  else
  {
    console.log("wrong");
  }
  res.redirect('/friends');
})

app.route('/delete_friend')
.post(async function (req, res)  { 
  if (req.body.delete){
    console.log("delete");
    await User.updateOne({username: req.session.username}, {$pull: { 'friends': req.body.friendlist}}) // update current user's friend request list to not include the requester
  }
  else {
    console.log("NO");
  }
  username =  req.session.userObj.username;
  const user = await User.findOne({ username }).lean()
  if(user)
  {
    req.session.userObj.friends = user.friends;
  }
  else
  {
    console.log("wrong");
  }
  res.redirect('/friends');
})


app.route('/viewProfile')
  .get(async function (req, res, next) {
    const username = req.query.friendprofile;
    console.log(username);
    const friend =  await User.findOne({username}).lean();//Find User to view profile
    req.query.userObj = friend;                           //Set userObj variable as found user
    next();                                               //Go to next function "middle ware(?) technique"
}, friendProfileHandler.getFriendProfile);


// URL handlers
app.get('/', landingHandler.getLanding);
app.get('/home', homeHandler.getHome);
app.get('/login', loginHandler.getLogin);
app.get('/itemListing', listItemsHandler.getItemList);
app.get('/register', registerHandler.getRegister);
app.get('/createItem', createItemHandler.getCreateItem);
app.get('/profile', profileHandler.getProfile);
app.get('/friends', friendsListHandler.getFriendsList);
app.get('/editProfile', editProfileHandler.geteditProfile);

//app.get('/viewProfile', friendProfileHandler.getFriendProfile,);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
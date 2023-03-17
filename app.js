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

// multer to I/O image
const multer = require('multer')
//const upload = multer({dest:'./public/images/'})
//multer Upload

const upload = multer({
  storage: multer.diskStorage({
      destination(req, file, cb) {
          cb(null, './public/images/item/');
      },
      filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

const uploadprofile = multer({
  storage: multer.diskStorage({
      destination(req, file, cb) {
          cb(null, './public/images/profile/');
      },
      filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

const mongo = require('./modules/MongoConnection.js').getInstance()

//import folders
// const config = require('config')
const { request } = require('http')

// import handlers
const landingHandler = require('./handlers/landing.js')
const homeHandler = require('./handlers/home.js')
const loginHandler = require('./handlers/login.js')
const listItemsHandler = require('./handlers/listItems.js')
const itemHandler = require('./handlers/item.js') // for displaying item page
const purchaseHandler = require('./handlers/purchase.js') // for displaying purchase page
const registerHandler = require('./handlers/register.js') 
const createItemHandler = require('./handlers/createItems.js') 
//const createItemHandler = require('./handlers/createItem.js')
const profileHandler = require('./handlers/profile.js')
const friendsListHandler = require('./handlers/friendsList')
const editProfileHandler = require('./handlers/editProfile.js')
const friendProfileHandler = require('./handlers/friendProfile.js')
const exploreHandler = require('./handlers/explore.js')

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

    //Latest on Top

    if (!user) {
      return res.redirect('/login?error=1') //No user found error
    }

    const sellingItems = await Item.find({$and :[{seller : user.username}, {purchased : false}]}).lean();
    const soldItems = await Item.find({$and :[{seller : user.username}, {purchased : true}]}).lean();
    const friendItems = await Item.find({$and: [{seller : {$ne : user.username}}, {purchased : false}]}).lean();
    const purchaseHistory = await Item.find({$and: [{_id : user.purchaseHistory}, {purchased : true}]}).sort({_id:-1}).lean();

    friendItems.sort(function (a,b){
      if (a.creationDate < b.creationDate) {return 1;}
      if (a.creationDate > b.creationDate) {return -1;}
      return 0;
      });

    if (password == user.password) {
      req.session.logged_in = true
      const curUser = new userObj.BaseUser(user.username, user.email, user.address, user.dateOfEntry, user.img, user.about, user.type, user.friends, user.friend_requests)
      req.session.userObj = curUser
      req.session.username = user.username
      req.session.email = user.email
      req.session.img = user.img
      req.session.about = user.about
      req.session.type = user.type
      req.session.myItems = sellingItems
      req.session.soldItems = soldItems
      req.session.friendItems = friendItems
      req.session.purchaseHistory = purchaseHistory

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

app.get('/getItems', function (req, res) {
  Item.find({
    type: 'Item',
  })
    .lean()
    .then(item => {
      res.json(item)
    })
})

//DEBUG RETURNS ALL USERS AS JSON 

app.get('/removeAllItems', async function(req, ress){
  const user = User.findOne(req.session.username).lean();
  //await User.updateOne({username: "Friend4"}, {$pull: {purchaseHistory: "641138e64680e90bb328eb3e"}})
  await Item.remove({})
  await User.remove({})
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
/*
  //List Items Page Route
  app.get('/itemListing', (req, res) => {
    console.log('Navigating to Items List Page')
    res.render('listItems')
  })
*/
  //CreateItem Page Route
  app.route('/createItem')
    .post(upload.single('chooseFile'), function(req,res){
        const { itemName, itemDescription, itemPrice } = req.body    
        var imgname;
        if(!req.file) { imgname = "default.png"}
        else{ imgname = req.file.filename}
        errorpage = "/createItem?error="
        haserror = false;
        if(itemName == "")
        {
          errorpage += "nName_"
          haserror = true;
        }
        if(itemDescription == "")
        {
          errorpage += "nDes_"
          haserror = true;
        }
        if(itemPrice == "")
        {
          errorpage += "nPrice_"
          haserror = true;
        }
      if(haserror)
      {
        haserror = false;delay
        res.redirect(errorpage)
      }
      else
      {
        
        var newItem = Item.create({
          name : itemName,
          seller : req.session.userObj.username,
          description : itemDescription,
          price : itemPrice,
          image : imgname   
        })

        res.redirect('/createItem_midpoint')
      }
    })
    
    app.get('/createItem_midpoint', async function (req, res) {
      const Items = await Item.find({$and :[{seller : req.session.username}, {purchased : false}]}).lean();
      const Items2 = await Item.find({seller : req.session.username}).lean(); //give delay();;
      console.log(Items);
      //console.log(Items2);
      req.session.myItems = Items;
      res.redirect('/itemListing')
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

app.route('/deleteItem')
.post(async function (req, res)  { 
  if (req.body.delete){
    console.log("delete");
    console.log(req.body.item)
    await Item.remove({_id : req.body.item});
  }
  else{
    console.log("wrong");
  }
  const Items = await Item.find({$and :[{seller : req.session.username}, {purchased : false}]}).lean();
  req.session.myItems = Items; 
  res.redirect('/itemListing');
})

app.route('/confirmPurchase')
  .post(async function(req,res){
    if (req.body.delete){
      console.log("confirmed");
      console.log(req.body.item)
      await Item.updateOne({_id : req.body.item}, {$set : {confirmed : true}});  
    }
    else{
      console.log("wrong");
    }
    const username = req.session.userObj.username;
    const user = await User.findOne({username}).lean(); 
    const purchaseHistory = await Item.find({$and: [{_id : user.purchaseHistory}, {purchased : true}, {confirmed : false}]}).lean();
    req.session.purchaseHistory = purchaseHistory;

    res.redirect('/profile');
  })



  // Overview Page Route
  //app.get('/overview', (req, res) => {
  //  console.log('Navigating to Overview/ItemListing Page')
  //  res.render('overview')
  //})

  //need to change the body though
  /*
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
*/
app.route('/buyItem')
  .post(async function (req, res)  { 
    if (req.body.buy){
      const username = req.session.username;
      await User.updateOne({username: username}, {$addToSet: { 'purchaseHistory': req.body.item}}) //Update Item ID in to purchase History
      await Item.updateOne({_id : req.body.item}, {$set : {purchased : true}});     
      const user = await User.findOne({username}).lean();                                                               //Remove purchased Item from table
      const friendItems = await Item.find({$and: [{seller : {$ne : user.username}}, {purchased : false}]}).lean();                                     //Update Session 
      const purchaseHistory = await Item.find({$and: [{_id : user.purchaseHistory}, {purchased : true}]}).sort({_id:-1}).lean();
      console.log(friendItems);
      //Latest on Top
      friendItems.sort(function (a,b){
        if (a.creationDate < b.creationDate) {return 1;}
        if (a.creationDate > b.creationDate) {return -1;}
        return 0;
        });
        
        req.session.friendItems = friendItems;
        req.session.purchaseHistory = purchaseHistory;
        console.log(req.session.purchaseHistory);
    }
    res.redirect('/home')
  });

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


app.route('/changeprofile')
.get(async function (req,res){
    const username = req.session.userObj.username;
    const user = await User.findOne({username}).lean();

    await User.updateOne({username: user.username}, {$set : {img: "Friend2.png"}})
});

app.route('/editimg')
.post(uploadprofile.single('chooseFile'), async function(req,res){
    var imgname;
    if(!req.file) { imgname = req.session.img}
    else{ imgname = req.file.filename}
    
    req.session.img = imgname;
    await User.updateOne({username: req.session.username}, {$set : {img: imgname}})

    res.redirect('/profile')
})

app.route('/editemail')
  .post(async function(req,res){
    const username = req.session.userObj.username;
    const user = await User.findOne({username}).lean();
    const email = req.body.email
    await User.updateOne({username: user.username}, {$set : {email: email}})
    req.session.email = email
    console.log(req.session.email)
    console.log(email)
    res.redirect('/profile')
});

app.route('/editusername')
  .post(async function(req,res){
    const email = req.session.email;
    const user = await User.findOne({email}).lean();
    const curname = req.session.username;
    const changename = req.body.username
    await User.updateOne({email: user.email}, {$set : {username: changename}})
    req.session.username = changename
    //Username has changed, change the name of items seller
    await Item.updateMany({seller: curname}, {$set: {seller : changename}})
    console.log(curname)
    console.log(changename)
    const Items = await Item.find({$and :[{seller : req.session.username}, {purchased : false}]}).lean();
    req.session.myItems = Items; 

    res.redirect('/profile')
});

app.route('/editabout')
  .post(async function(req,res){
    const username = req.session.username;
    const user = await User.findOne({username}).lean();
    const about = req.body.about
    await User.updateOne({username: user.username}, {$set : {about: about}})
    req.session.about = about
    res.redirect('/profile')
});

app.route('/editpassword')
  .post(async function(req,res){
    const username = req.session.username;
    const user = await User.findOne({username}).lean();
    const password = req.body.password
    await User.updateOne({username: user.username}, {$set : {password: password}})
    req.session.password = password

    res.redirect('/profile')
});

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
app.get('/item/:item_id', itemHandler.getItem);
app.get('/item/:item_id/purchase', purchaseHandler.getPurchase);
app.get('/explore', exploreHandler.getExplore);

//app.get('/viewProfile', friendProfileHandler.getFriendProfile,);

module.exports = app;
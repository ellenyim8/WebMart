const Items = require("../models/Items");
const User = require('../models/User')

async function getExplore(request, response){
  if(request.session.logged_in){
    console.log("Redirect to home, current user: "+request.session.username);    
    cur_user = request.session.userObj  
    const item_list = await Items.find({$and: [{seller : {$ne : cur_user.username}}, {purchased : false}]}).lean();
    response.render('explore', {
        title: 'WebMart', 
        username: request.session.username, 
        userObj: request.session.userObj,
        item_list: item_list,
        isAdmin: false
      });
    }
  else{
    console.log("Not logged in, redirecting")
    response.redirect("/login")
  }
}

module.exports = {
    getExplore
};
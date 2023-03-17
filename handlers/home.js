const { off } = require("process");
const Items = require("../models/Items");
const User = require('../models/User')

async function getHome(request, response){
  if(request.session.logged_in){
    console.log("Redirect to home, current user: "+request.session.username);    
    //Render Admin View
    if (request.session.type == 'Admin') {
      response.render('home', {
        title: 'WebMart', 
        username: request.session.username, 
        userObj: request.session.userObj,
        friendItems: request.session.friendItems,
        isAdmin: true
      });
    }

    //Render User View
    else if (request.session.type == 'User') {
      cur_user = request.session.userObj

      // get list of your recent purchases
      recent_purchases = request.session.purchaseHistory
      // const recent_purchases = await Items.find({$and: [{_id : cur_user.purchaseHistory}, {purchased : true}]}).lean();
      while (recent_purchases.length>4){
        recent_purchases.pop()
      }

      // get list of each friend's recently bought items
      // get list of each friend's selling items
      const friends = cur_user.friends
      friends_item_list = []
      friends_bought_items = [] 
      for (f of friends){
        f_user = await User.findOne({username: f}).lean()
        f_item = await Items.find({$and: [{seller: f_user.username},  {purchased : false}]}).lean()
        friends_item_list.push(...f_item)
        f_purchases = await Items.find({$and: [{_id : f_user.purchaseHistory}, {purchased : true}]}).lean();
        friends_bought_items.push(...f_purchases)
      }
      console.log(friends_bought_items)
      console.log(friends_bought_items[0].name)

      response.render('home', {
        title: 'WebMart', 
        username: request.session.username, 
        userObj: request.session.userObj,
        friendItems: friends_item_list,
        friendsItemsBought: friends_bought_items,
        recent_purchases: recent_purchases,
        isAdmin: false
      });
    }
  }
  else{
    console.log("Not logged in, redirecting")
    response.redirect("/login")
  }
}

module.exports = {
    getHome
};
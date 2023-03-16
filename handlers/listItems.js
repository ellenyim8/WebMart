// const Item = require('../models/Items'); For future use, get list of auction items to display to user
function getItemList(request, response){
    if(request.session.logged_in){
      console.log("Redirect to list items page, current user: "+request.session.username);
      //response.render('home', {title: 'WebMart', username: request.session.username}); //loads username as var
      //Render Admin View
      if (request.session.type == 'Admin') {
        response.render('listItems', {
          title: 'WebMart', 
          username: request.session.username, 
          myItems: request.session.myItems,
          soldItems : request.session.soldItems,
          isAdmin: true
        });
      } 
      //Render User View
      else if (request.session.type == 'User') {
        response.render('listItems', {
          title: 'WebMart', 
          username: request.session.username,
          myItems: request.session.myItems,
          soldItems : request.session.soldItems,
          isAdmin: false
        });
        console.log("logedin")
      }
    }
    else{
      response.redirect("/login")
    }
  }
  
  module.exports = {
      getItemList
  };

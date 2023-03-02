// const Item = require('../models/Items'); For future use, get list of auction items to display to user
function getItemList(request, response){
    if(request.session.logged_in){
      console.log("Redirect to list items page, current user: "+request.session.username);
      response.render('listItems', {title: 'WebMart', username: request.session.username}); //loads username as var
      //Render Admin View
      if (request.session.type == 'Admin') {
        response.render('home', {
          title: 'WebMart', 
          username: request.session.username, 
          isAdmin: true
        });
      }
  
      //Render User View
      else if (request.session.type == 'User') {
        response.render('home', {
          title: 'WebMart', 
          username: request.session.username, 
          isAdmin: false
        });
      }
    }
    else{
      //console.log("Not logged in, redirecting")
      //response.redirect("/login")
      response.render('home', {title: 'WebMart - Home Page'});
    }
  }
  
  module.exports = {
      getItemList
  };

// const Item = require('../models/Items'); For future use, get list of auction items to display to user
function getHome(request, response){
  if(request.session.logged_in){
    console.log("Redirect to home, current user: "+request.session.username);
    
    //Render Admin View
    if (request.session.type == 'Admin') {
      response.render('home', {
        title: 'Auction', 
        username: request.session.username, 
        userObj: request.session.userObj,
        isAdmin: true
      });
    }

    //Render User View
    else if (request.session.type == 'User') {
      response.render('home', {
        title: 'Auction', 
        username: request.session.username, 
        userObj: request.session.userObj,
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
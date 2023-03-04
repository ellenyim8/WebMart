const User = require('../models/User');
function getFriendsList(request, response){
  if(request.session.logged_in){
      response.render('friendsList', {title: 'Friends', userObj: request.session.userObj,});
  }
  else{
    console.log("Not logged in, redirecting")
    response.redirect("/login")
  }
}

module.exports = {
    getFriendsList
};
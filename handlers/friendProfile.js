function getFriendProfile(request, response){
    if(request.session.logged_in){
        response.render('friendProfile', {
          title: 'WebMart - friendProfile',
          username : request.query.friendprofile,
          userObj : request.query.userObj
        });
    }
    else
    {
      response.redirect("/login");
    }
  }
  
  module.exports = {
      getFriendProfile
  };


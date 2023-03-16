function getProfile(request, response){ //handler for profile
    if(request.session.logged_in){
      console.log("Redirect to profile page, current user: "+request.session.username);
      response.render('profile', {
        title: 'WebMart',
        userObj : request.session.userObj,
        username: request.session.username,
        address: request.session.address,
        email: request.session.email,
        img: request.session.img,
        about: request.session.about,
        type: request.session.type,
        purchaseHistory : request.session.purchaseHistory
       });
    }
    else{
      response.render('profile', {title: 'WebMart - Profile'});
    }
  }
  
  module.exports = {
      getProfile
  };
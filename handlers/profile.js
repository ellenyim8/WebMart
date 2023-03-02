function getProfile(request, response){ //handler for profile
    if(request.session.logged_in){
      console.log("Redirect to profile page, current user: "+request.session.username);
      response.render('profile', {
        title: 'WebMart',
        username: request.session.username,
        address: request.session.address,
        email: request.session.email,
        img: request.session.img,
        about: request.session.about,
       });
    }
    else{
      response.render('profile', {title: 'WebMart - Profile'});
    }
  }
  
  module.exports = {
      getProfile
  };
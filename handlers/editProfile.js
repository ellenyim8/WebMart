function geteditProfile(request, response){
    if(request.session.logged_in){
        console.log("Redirect to edit profile page, current user: "+request.session.username);
        response.render('editProfile', {title: 'WebMart - editProfile'});
    }
    else{
      response.render('editProfile', {title: 'WebMart - editProfile'});
    }
  }
  
  module.exports = {
      geteditProfile
  };